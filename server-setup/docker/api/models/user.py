from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

class User(db.Model):
    """Модель пользователя VPN"""
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(80), unique=True, nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=True)
    is_anonymous = db.Column(db.Boolean, default=True)
    is_premium = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    
    # Лимиты и использование
    data_limit = db.Column(db.BigInteger, default=10737418240)  # 10GB для бесплатных
    data_used = db.Column(db.BigInteger, default=0)
    device_limit = db.Column(db.Integer, default=1)
    devices_connected = db.Column(db.Integer, default=0)
    
    # Временные метки
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    premium_expires = db.Column(db.DateTime)
    
    # Настройки пользователя
    preferred_protocol = db.Column(db.String(20), default='wireguard')
    auto_connect = db.Column(db.Boolean, default=False)
    kill_switch = db.Column(db.Boolean, default=True)
    dns_protection = db.Column(db.Boolean, default=True)
    
    # Связи
    vpn_clients = db.relationship('VPNClient', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<User {self.id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'is_anonymous': self.is_anonymous,
            'is_premium': self.is_premium,
            'is_active': self.is_active,
            'data_limit': self.data_limit,
            'data_used': self.data_used,
            'device_limit': self.device_limit,
            'devices_connected': self.devices_connected,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'premium_expires': self.premium_expires.isoformat() if self.premium_expires else None,
            'preferred_protocol': self.preferred_protocol,
            'auto_connect': self.auto_connect,
            'kill_switch': self.kill_switch,
            'dns_protection': self.dns_protection
        }
    
    def get_data_usage_percentage(self):
        """Получить процент использования трафика"""
        if self.is_premium:
            return 0  # Безлимит для премиум
        return (self.data_used / self.data_limit) * 100 if self.data_limit > 0 else 0
    
    def can_create_client(self):
        """Проверить, может ли пользователь создать новый клиент"""
        return len(self.vpn_clients) < self.device_limit
    
    def increment_data_usage(self, bytes_used):
        """Увеличить использование трафика"""
        self.data_used += bytes_used
        db.session.commit()
    
    @staticmethod
    def create_anonymous_user():
        """Создать анонимного пользователя"""
        user = User(
            is_anonymous=True,
            data_limit=10737418240,  # 10GB
            device_limit=1
        )
        db.session.add(user)
        db.session.commit()
        return user