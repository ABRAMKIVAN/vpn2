#!/usr/bin/env python3
"""
SecureVPN Management API
Управление VPN сервером через REST API
"""

import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
import redis
from datetime import datetime, timedelta
import logging
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST

# Инициализация Flask приложения
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'DATABASE_URL', 
    'postgresql://vpnuser:password@postgres:5432/securevpn'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Инициализация расширений
CORS(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Redis для кэширования
redis_client = redis.Redis(host='redis', port=6379, db=0, decode_responses=True)

# Логирование
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Prometheus метрики
REQUEST_COUNT = Counter('vpn_api_requests_total', 'Total API requests', ['method', 'endpoint'])
REQUEST_DURATION = Histogram('vpn_api_request_duration_seconds', 'Request duration')
ACTIVE_CONNECTIONS = Counter('vpn_active_connections_total', 'Active VPN connections', ['protocol'])

# Импорт моделей
from models.user import User
from models.vpn_client import VPNClient
from models.server_stats import ServerStats

# Импорт маршрутов
from routes.auth import auth_bp
from routes.vpn import vpn_bp
from routes.admin import admin_bp
from routes.stats import stats_bp

# Регистрация Blueprint'ов
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(vpn_bp, url_prefix='/api/vpn')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(stats_bp, url_prefix='/api/stats')

@app.before_request
def before_request():
    """Middleware для логирования и метрик"""
    request.start_time = datetime.utcnow()

@app.after_request
def after_request(response):
    """Middleware для завершения запроса"""
    if hasattr(request, 'start_time'):
        duration = (datetime.utcnow() - request.start_time).total_seconds()
        REQUEST_DURATION.observe(duration)
        REQUEST_COUNT.labels(method=request.method, endpoint=request.endpoint).inc()
    return response

@app.route('/api/health', methods=['GET'])
def health_check():
    """Проверка здоровья API"""
    try:
        # Проверка подключения к базе данных
        db.session.execute('SELECT 1')
        
        # Проверка подключения к Redis
        redis_client.ping()
        
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'version': '1.0.0',
            'services': {
                'database': 'online',
                'redis': 'online'
            }
        })
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return jsonify({
            'status': 'unhealthy',
            'timestamp': datetime.utcnow().isoformat(),
            'error': str(e)
        }), 503

@app.route('/api/system/status', methods=['GET'])
def system_status():
    """Системная информация сервера"""
    try:
        import subprocess
        import psutil
        
        # Статус VPN служб
        services = {}
        for service in ['wireguard', 'shadowsocks', 'xray']:
            try:
                result = subprocess.run(
                    ['systemctl', 'is-active', service], 
                    capture_output=True, 
                    text=True
                )
                services[service] = result.stdout.strip() == 'active'
            except:
                services[service] = False
        
        # Системные метрики
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        return jsonify({
            'services': services,
            'system': {
                'cpu_percent': cpu_percent,
                'memory_percent': memory.percent,
                'disk_percent': (disk.used / disk.total) * 100,
                'uptime': subprocess.run(['uptime', '-p'], capture_output=True, text=True).stdout.strip()
            },
            'server_ip': os.environ.get('SERVER_IP', 'unknown'),
            'timestamp': datetime.utcnow().isoformat()
        })
    except Exception as e:
        logger.error(f"System status error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/metrics')
def metrics():
    """Prometheus метрики"""
    return generate_latest(), 200, {'Content-Type': CONTENT_TYPE_LATEST}

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(Exception)
def handle_exception(e):
    logger.error(f"Unhandled exception: {str(e)}")
    return jsonify({'error': 'An unexpected error occurred'}), 500

if __name__ == '__main__':
    # Создание таблиц в базе данных
    with app.app_context():
        db.create_all()
    
    # Запуск приложения
    app.run(host='0.0.0.0', port=5000, debug=False)