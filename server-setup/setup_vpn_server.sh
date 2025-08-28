#!/bin/bash

# ===============================================================================
# SecureVPN Server Setup Script for Ubuntu 24.04
# Поддерживает: WireGuard, ShadowSocks, VLESS+Reality (Xray)
# Автор: SecureVPN Team
# ===============================================================================

set -e  # Остановить выполнение при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Логирование
LOG_FILE="/var/log/securevpn-setup.log"
exec 1> >(tee -a "$LOG_FILE")
exec 2> >(tee -a "$LOG_FILE" >&2)

echo -e "${CYAN}======================================================${NC}"
echo -e "${CYAN}        SecureVPN Server Setup Script v1.0           ${NC}"
echo -e "${CYAN}======================================================${NC}"
echo -e "${BLUE}Дата: $(date)${NC}"
echo -e "${BLUE}Система: $(lsb_release -d | cut -f2)${NC}"
echo -e "${BLUE}Ядро: $(uname -r)${NC}"
echo ""

# Проверка прав root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}Этот скрипт должен запускаться от имени root${NC}"
   echo -e "${YELLOW}Используйте: sudo bash setup_vpn_server.sh${NC}"
   exit 1
fi

# Переменные конфигурации
SERVER_IP=$(curl -s https://ipinfo.io/ip)
SERVER_NAME="SecureVPN-$(hostname)"
DOMAIN="your-domain.com"  # Заменить на ваш домен
EMAIL="admin@your-domain.com"  # Заменить на ваш email

# Порты по умолчанию
WIREGUARD_PORT=51820
SHADOWSOCKS_PORT=8388
XRAY_PORT=443
API_PORT=8080

# Функция для отображения прогресса
show_progress() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

show_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

show_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

show_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Функция установки пакетов
install_packages() {
    show_progress "Обновление системы и установка базовых пакетов..."
    
    apt update && apt upgrade -y
    apt install -y \
        curl \
        wget \
        unzip \
        tar \
        jq \
        ufw \
        fail2ban \
        nginx \
        certbot \
        python3-certbot-nginx \
        docker.io \
        docker-compose \
        htop \
        iftop \
        python3-pip \
        qrencode \
        resolvconf
        
    systemctl enable docker
    systemctl start docker
    
    show_success "Базовые пакеты установлены"
}

# Установка WireGuard
install_wireguard() {
    show_progress "Установка WireGuard..."
    
    apt install -y wireguard wireguard-tools
    
    # Создание ключей сервера
    cd /etc/wireguard
    wg genkey | tee server_private.key | wg pubkey > server_public.key
    chmod 600 server_private.key
    
    SERVER_PRIVATE_KEY=$(cat server_private.key)
    SERVER_PUBLIC_KEY=$(cat server_public.key)
    
    # Конфигурация WireGuard
    cat > wg0.conf << EOF
[Interface]
PrivateKey = ${SERVER_PRIVATE_KEY}
Address = 10.13.13.1/24
ListenPort = ${WIREGUARD_PORT}
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# DNS серверы (Cloudflare + Quad9)
DNS = 1.1.1.1, 9.9.9.9

# Клиентские конфигурации будут добавлены автоматически
EOF
    
    # Включение IP forwarding
    echo 'net.ipv4.ip_forward=1' >> /etc/sysctl.conf
    echo 'net.ipv6.conf.all.forwarding=1' >> /etc/sysctl.conf
    sysctl -p
    
    systemctl enable wg-quick@wg0
    systemctl start wg-quick@wg0
    
    show_success "WireGuard настроен (порт ${WIREGUARD_PORT})"
}

# Установка ShadowSocks
install_shadowsocks() {
    show_progress "Установка ShadowSocks..."
    
    pip3 install shadowsocks
    
    # Генерация пароля
    SS_PASSWORD=$(openssl rand -base64 16)
    
    # Конфигурация ShadowSocks
    mkdir -p /etc/shadowsocks
    cat > /etc/shadowsocks/config.json << EOF
{
    "server": "0.0.0.0",
    "server_port": ${SHADOWSOCKS_PORT},
    "password": "${SS_PASSWORD}",
    "method": "chacha20-ietf-poly1305",
    "timeout": 300,
    "fast_open": true,
    "workers": 4,
    "prefer_ipv6": false,
    "no_delay": true,
    "plugin": "obfs-server",
    "plugin_opts": "obfs=tls;fast-open;t=400"
}
EOF

    # Создание systemd службы
    cat > /etc/systemd/system/shadowsocks.service << EOF
[Unit]
Description=ShadowSocks Server
After=network.target

[Service]
Type=simple
User=nobody
ExecStart=/usr/local/bin/ssserver -c /etc/shadowsocks/config.json
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

    systemctl enable shadowsocks
    systemctl start shadowsocks
    
    echo "${SS_PASSWORD}" > /etc/shadowsocks/password.txt
    chmod 600 /etc/shadowsocks/password.txt
    
    show_success "ShadowSocks настроен (порт ${SHADOWSOCKS_PORT})"
}

# Установка Xray для VLESS+Reality
install_xray() {
    show_progress "Установка Xray (VLESS+Reality)..."
    
    # Загрузка и установка Xray
    wget -O xray-install.sh https://github.com/XTLS/Xray-install/raw/main/install-release.sh
    bash xray-install.sh
    rm xray-install.sh
    
    # Генерация UUID и ключей
    XRAY_UUID=$(cat /proc/sys/kernel/random/uuid)
    PRIVATE_KEY=$(xray x25519)
    PUBLIC_KEY=$(echo "${PRIVATE_KEY}" | tail -n1)
    PRIVATE_KEY=$(echo "${PRIVATE_KEY}" | head -n1)
    SHORT_ID=$(openssl rand -hex 8)
    
    # Конфигурация Xray
    cat > /usr/local/etc/xray/config.json << EOF
{
    "log": {
        "loglevel": "warning"
    },
    "inbounds": [
        {
            "port": ${XRAY_PORT},
            "protocol": "vless",
            "settings": {
                "clients": [
                    {
                        "id": "${XRAY_UUID}",
                        "flow": "xtls-rprx-vision"
                    }
                ],
                "decryption": "none"
            },
            "streamSettings": {
                "network": "tcp",
                "security": "reality",
                "realitySettings": {
                    "show": false,
                    "dest": "www.microsoft.com:443",
                    "xver": 0,
                    "serverNames": [
                        "www.microsoft.com"
                    ],
                    "privateKey": "${PRIVATE_KEY}",
                    "shortIds": [
                        "${SHORT_ID}"
                    ]
                }
            }
        }
    ],
    "outbounds": [
        {
            "protocol": "freedom"
        }
    ]
}
EOF

    systemctl enable xray
    systemctl start xray
    
    # Сохранение конфигурации
    cat > /usr/local/etc/xray/client_info.txt << EOF
UUID: ${XRAY_UUID}
Public Key: ${PUBLIC_KEY}
Short ID: ${SHORT_ID}
Server: ${SERVER_IP}
Port: ${XRAY_PORT}
SNI: www.microsoft.com
EOF
    
    show_success "Xray (VLESS+Reality) настроен (порт ${XRAY_PORT})"
}

# Настройка файрвола
configure_firewall() {
    show_progress "Настройка файрвола UFW..."
    
    ufw --force reset
    ufw default deny incoming
    ufw default allow outgoing
    
    # SSH
    ufw allow 22/tcp
    
    # HTTP/HTTPS
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # VPN порты
    ufw allow ${WIREGUARD_PORT}/udp
    ufw allow ${SHADOWSOCKS_PORT}/tcp
    ufw allow ${XRAY_PORT}/tcp
    ufw allow ${API_PORT}/tcp
    
    # DNS
    ufw allow 53/tcp
    ufw allow 53/udp
    
    ufw --force enable
    
    show_success "Файрвол настроен"
}

# Установка Pi-hole для DNS защиты
install_pihole() {
    show_progress "Установка Pi-hole для DNS защиты..."
    
    # Автоматическая установка Pi-hole
    curl -L https://install.pi-hole.net | bash /dev/stdin --unattended --disable-install-web-server
    
    # Настройка пароля для веб-интерфейса
    PIHOLE_PASSWORD=$(openssl rand -base64 12)
    echo "${PIHOLE_PASSWORD}" | pihole -a -p
    
    echo "${PIHOLE_PASSWORD}" > /etc/pihole/web_password.txt
    chmod 600 /etc/pihole/web_password.txt
    
    show_success "Pi-hole установлен (пароль в /etc/pihole/web_password.txt)"
}

# Настройка мониторинга
setup_monitoring() {
    show_progress "Настройка мониторинга системы..."
    
    # Установка Node Exporter для Prometheus
    useradd --no-create-home --shell /bin/false node_exporter
    
    wget https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz
    tar xvf node_exporter-1.6.1.linux-amd64.tar.gz
    cp node_exporter-1.6.1.linux-amd64/node_exporter /usr/local/bin/
    chown node_exporter:node_exporter /usr/local/bin/node_exporter
    rm -rf node_exporter-1.6.1.linux-amd64*
    
    # Systemd служба для Node Exporter
    cat > /etc/systemd/system/node_exporter.service << EOF
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=node_exporter
Group=node_exporter
Type=simple
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=multi-user.target
EOF

    systemctl enable node_exporter
    systemctl start node_exporter
    
    show_success "Мониторинг настроен"
}

# Создание API для управления
create_management_api() {
    show_progress "Создание API для управления VPN..."
    
    mkdir -p /opt/securevpn-api
    
    cat > /opt/securevpn-api/app.py << 'EOF'
#!/usr/bin/env python3
from flask import Flask, jsonify, request
from flask_cors import CORS
import subprocess
import json
import os
import uuid

app = Flask(__name__)
CORS(app)

@app.route('/api/status', methods=['GET'])
def get_status():
    try:
        # WireGuard статус
        wg_result = subprocess.run(['wg', 'show'], capture_output=True, text=True)
        wg_active = wg_result.returncode == 0
        
        # ShadowSocks статус
        ss_result = subprocess.run(['systemctl', 'is-active', 'shadowsocks'], capture_output=True, text=True)
        ss_active = ss_result.stdout.strip() == 'active'
        
        # Xray статус
        xray_result = subprocess.run(['systemctl', 'is-active', 'xray'], capture_output=True, text=True)
        xray_active = xray_result.stdout.strip() == 'active'
        
        return jsonify({
            'wireguard': wg_active,
            'shadowsocks': ss_active,
            'xray': xray_active,
            'server_ip': os.environ.get('SERVER_IP', 'unknown')
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/clients', methods=['POST'])
def create_client():
    try:
        data = request.get_json()
        protocol = data.get('protocol', 'wireguard')
        client_name = data.get('name', f'client_{uuid.uuid4().hex[:8]}')
        
        if protocol == 'wireguard':
            # Генерация конфигурации WireGuard клиента
            result = subprocess.run([
                'bash', '/opt/securevpn-api/create_wg_client.sh', client_name
            ], capture_output=True, text=True)
            
            if result.returncode == 0:
                return jsonify({
                    'config': result.stdout,
                    'client_name': client_name,
                    'protocol': 'wireguard'
                })
            else:
                return jsonify({'error': result.stderr}), 500
                
        # Добавить обработку других протоколов
        return jsonify({'error': 'Protocol not supported'}), 400
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=False)
EOF

    # Скрипт для создания WireGuard клиентов
    cat > /opt/securevpn-api/create_wg_client.sh << 'EOF'
#!/bin/bash
CLIENT_NAME=$1
WG_CONFIG_DIR="/etc/wireguard"
CLIENT_DIR="/etc/wireguard/clients"

mkdir -p $CLIENT_DIR

# Генерация ключей клиента
CLIENT_PRIVATE_KEY=$(wg genkey)
CLIENT_PUBLIC_KEY=$(echo $CLIENT_PRIVATE_KEY | wg pubkey)

# Получение следующего IP
LAST_IP=$(grep -o '10\.13\.13\.[0-9]*' $WG_CONFIG_DIR/wg0.conf | tail -1 | cut -d'.' -f4)
if [ -z "$LAST_IP" ]; then
    CLIENT_IP="10.13.13.2"
else
    CLIENT_IP="10.13.13.$((LAST_IP + 1))"
fi

# Добавление клиента в конфигурацию сервера
cat >> $WG_CONFIG_DIR/wg0.conf << EOL

# Client: $CLIENT_NAME
[Peer]
PublicKey = $CLIENT_PUBLIC_KEY
AllowedIPs = $CLIENT_IP/32
EOL

# Создание конфигурации клиента
cat > $CLIENT_DIR/$CLIENT_NAME.conf << EOL
[Interface]
PrivateKey = $CLIENT_PRIVATE_KEY
Address = $CLIENT_IP/24
DNS = 10.13.13.1

[Peer]
PublicKey = $(cat $WG_CONFIG_DIR/server_public.key)
Endpoint = $(curl -s https://ipinfo.io/ip):51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
EOL

# Перезапуск WireGuard
systemctl restart wg-quick@wg0

# Вывод конфигурации
cat $CLIENT_DIR/$CLIENT_NAME.conf
EOF

    chmod +x /opt/securevpn-api/create_wg_client.sh
    
    # Установка Flask
    pip3 install flask flask-cors
    
    # Systemd служба для API
    cat > /etc/systemd/system/securevpn-api.service << EOF
[Unit]
Description=SecureVPN Management API
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/securevpn-api
ExecStart=/usr/bin/python3 /opt/securevpn-api/app.py
Restart=on-failure
RestartSec=5
Environment=SERVER_IP=${SERVER_IP}

[Install]
WantedBy=multi-user.target
EOF

    systemctl enable securevpn-api
    systemctl start securevpn-api
    
    show_success "API для управления создан (порт ${API_PORT})"
}

# SSL сертификаты через Let's Encrypt
setup_ssl() {
    if [ "$DOMAIN" != "your-domain.com" ]; then
        show_progress "Настройка SSL сертификатов для домена ${DOMAIN}..."
        
        # Nginx конфигурация
        cat > /etc/nginx/sites-available/securevpn << EOF
server {
    listen 80;
    server_name ${DOMAIN};
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${DOMAIN};
    
    location /api/ {
        proxy_pass http://localhost:${API_PORT}/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
    
    location / {
        root /var/www/html;
        index index.html;
    }
}
EOF
        
        ln -sf /etc/nginx/sites-available/securevpn /etc/nginx/sites-enabled/
        rm -f /etc/nginx/sites-enabled/default
        
        nginx -t && systemctl reload nginx
        
        # Получение SSL сертификата
        certbot --nginx -d ${DOMAIN} --non-interactive --agree-tos --email ${EMAIL}
        
        show_success "SSL сертификаты настроены для ${DOMAIN}"
    else
        show_warning "Домен не настроен. Пропуск SSL конфигурации."
    fi
}

# Главная функция установки
main() {
    echo -e "${PURPLE}Начинаем установку SecureVPN сервера...${NC}"
    echo ""
    
    install_packages
    install_wireguard
    install_shadowsocks
    install_xray
    configure_firewall
    install_pihole
    setup_monitoring
    create_management_api
    setup_ssl
    
    echo ""
    echo -e "${GREEN}======================================================${NC}"
    echo -e "${GREEN}       SecureVPN Server успешно установлен!          ${NC}"
    echo -e "${GREEN}======================================================${NC}"
    echo ""
    echo -e "${CYAN}Информация о сервере:${NC}"
    echo -e "${BLUE}IP адрес:${NC} ${SERVER_IP}"
    echo -e "${BLUE}WireGuard порт:${NC} ${WIREGUARD_PORT}"
    echo -e "${BLUE}ShadowSocks порт:${NC} ${SHADOWSOCKS_PORT}"
    echo -e "${BLUE}Xray порт:${NC} ${XRAY_PORT}"
    echo -e "${BLUE}API порт:${NC} ${API_PORT}"
    echo ""
    echo -e "${CYAN}Файлы конфигурации:${NC}"
    echo -e "${BLUE}WireGuard:${NC} /etc/wireguard/wg0.conf"
    echo -e "${BLUE}ShadowSocks:${NC} /etc/shadowsocks/config.json"
    echo -e "${BLUE}Xray:${NC} /usr/local/etc/xray/config.json"
    echo -e "${BLUE}Пароль ShadowSocks:${NC} /etc/shadowsocks/password.txt"
    echo -e "${BLUE}Данные Xray:${NC} /usr/local/etc/xray/client_info.txt"
    echo -e "${BLUE}Пароль Pi-hole:${NC} /etc/pihole/web_password.txt"
    echo ""
    echo -e "${CYAN}Полезные команды:${NC}"
    echo -e "${BLUE}Статус служб:${NC} systemctl status wireguard shadowsocks xray"
    echo -e "${BLUE}Логи:${NC} journalctl -u wireguard -f"
    echo -e "${BLUE}Добавить клиента WG:${NC} /opt/securevpn-api/create_wg_client.sh <имя>"
    echo -e "${BLUE}API статус:${NC} curl http://${SERVER_IP}:${API_PORT}/api/status"
    echo ""
    echo -e "${YELLOW}Не забудьте:${NC}"
    echo -e "${YELLOW}1. Сменить домен в переменной DOMAIN${NC}"
    echo -e "${YELLOW}2. Настроить DNS записи для домена${NC}"
    echo -e "${YELLOW}3. Проверить все пароли в соответствующих файлах${NC}"
    echo -e "${YELLOW}4. Настроить регулярные бэкапы конфигураций${NC}"
    echo ""
    echo -e "${GREEN}Лог установки сохранен в: ${LOG_FILE}${NC}"
}

# Запуск установки
main "$@"