# SecureVPN - Кроссплатформенное VPN приложение

![SecureVPN Logo](https://img.shields.io/badge/SecureVPN-v1.0.0-blue)
![React Native](https://img.shields.io/badge/React_Native-0.73-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1.3-blue)
![Expo](https://img.shields.io/badge/Expo-50.0-black)

**SecureVPN** - это современное, безопасное и простое в использовании VPN приложение с нейморфным дизайном для iOS, Android и Web платформ.

## 🌟 Особенности

### 🎨 **Современный дизайн**
- **Нейморфный дизайн** в стиле Proton VPN
- **Темная/светлая тема** с плавными переходами
- **Интерактивная карта мира** с серверными локациями
- **Анимации** подключения и состояния

### 🔒 **Безопасность**
- **3 протокола VPN**: WireGuard, ShadowSocks, VLESS+Reality
- **Kill Switch** - блокировка интернета при разрыве VPN
- **DNS защита** с интеграцией Pi-hole
- **Анонимная регистрация** без email
- **Шифрование**: ChaCha20, TLS, Reality

### 🚀 **Функциональность**
- **Одним кликом** подключение/отключение
- **Автовыбор** оптимального сервера
- **Тест скорости** и пинг серверов
- **Статистика трафика** с графиками
- **Мульти-устройства** синхронизация
- **Уведомления** о состоянии соединения

### 🗺️ **Глобальная сеть**
- Серверы в **10+ странах**
- **Автоматический выбор** ближайшего сервера
- **Балансировка нагрузки**
- **Мониторинг качества** соединения

## 📱 Скриншоты

| Главный экран | Карта серверов | Настройки |
|---------------|----------------|-----------|
| ![Home](docs/screenshots/home.png) | ![Servers](docs/screenshots/servers.png) | ![Settings](docs/screenshots/settings.png) |

## 🛠️ Технологический стек

### Frontend (Приложение)
- **React Native** 0.73 + Expo 50
- **TypeScript** для типобезопасности
- **NativeWind** (Tailwind CSS для React Native)
- **React Navigation** для навигации
- **React Native SVG** для карты мира
- **Reanimated** для анимаций

### Backend (Сервер)
- **Ubuntu 24.04** LTS
- **Docker Compose** для контейнеризации
- **WireGuard** - быстрый и безопасный
- **ShadowSocks** - обход блокировок
- **Xray + VLESS+Reality** - максимальная скрытность
- **Pi-hole** - DNS фильтрация
- **Nginx** - веб-сервер и прокси
- **PostgreSQL** - база данных
- **Redis** - кэширование
- **Prometheus + Grafana** - мониторинг

## 🚀 Быстрый старт

### Для пользователей (не-программистов)

#### 1. Настройка мобильного приложения

```bash
# Клонирование репозитория
git clone https://github.com/your-username/secure-vpn-app.git
cd secure-vpn-app

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm start

# Сканируйте QR-код в Expo Go приложении
```

#### 2. Настройка VPS сервера (Hetzner/DigitalOcean)

```bash
# Подключение к серверу
ssh root@YOUR_SERVER_IP

# Загрузка и запуск скрипта установки
wget https://raw.githubusercontent.com/your-repo/secure-vpn-app/main/server-setup/setup_vpn_server.sh
chmod +x setup_vpn_server.sh
sudo bash setup_vpn_server.sh
```

#### 3. Первоначальная настройка

1. **Домен** (опционально):
   ```bash
   # Отредактируйте переменные в скрипте
   nano setup_vpn_server.sh
   # Измените DOMAIN="your-domain.com"
   ```

2. **SSL сертификат**:
   ```bash
   # После настройки домена
   certbot --nginx -d your-domain.com
   ```

3. **Проверка работы**:
   ```bash
   # Статус служб
   systemctl status wireguard shadowsocks xray
   
   # API статус
   curl http://YOUR_SERVER_IP:8080/api/status
   ```

### Для разработчиков

#### Требования
- **Node.js** 18+ и npm
- **React Native CLI** или **Expo CLI**
- **Docker** и **Docker Compose**
- **Git**

#### Локальная разработка

```bash
# Клонирование
git clone https://github.com/your-username/secure-vpn-app.git
cd secure-vpn-app

# Установка зависимостей
npm install

# Запуск iOS симулятора
npm run ios

# Запуск Android эмулятора  
npm run android

# Запуск веб-версии
npm run web

# Тестирование
npm test

# Линтинг
npm run lint
```

## 📋 Подробные инструкции

### 1. Настройка React Native приложения

#### Установка на компьютер

**Windows:**
```bash
# Установка Node.js
winget install OpenJS.NodeJS

# Установка Expo CLI
npm install -g @expo/cli

# Клонирование проекта
git clone https://github.com/your-username/secure-vpn-app.git
cd secure-vpn-app

# Установка зависимостей
npm install

# Запуск проекта
npm start
```

**macOS:**
```bash
# Установка через Homebrew
brew install node
npm install -g @expo/cli

# Клонирование и запуск
git clone https://github.com/your-username/secure-vpn-app.git
cd secure-vpn-app
npm install
npm start
```

**Ubuntu/Debian:**
```bash
# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка Expo CLI
sudo npm install -g @expo/cli

# Клонирование и запуск
git clone https://github.com/your-username/secure-vpn-app.git
cd secure-vpn-app
npm install
npm start
```

#### Тестирование на устройстве

1. **Установите Expo Go** из App Store/Google Play
2. **Запустите** `npm start` в терминале
3. **Отсканируйте QR-код** в Expo Go приложении

### 2. Настройка VPN сервера

#### Требования к серверу
- **ОС**: Ubuntu 24.04 LTS
- **RAM**: минимум 2GB (рекомендуется 4GB+)
- **CPU**: 2+ ядра
- **Диск**: 20GB+ SSD
- **Сеть**: 1Gbps подключение

#### Популярные провайдеры VPS

**Hetzner Cloud** (рекомендуется):
```bash
# CPX21: 3 vCPU, 4GB RAM, 80GB SSD - €4.15/месяц
# Регистрация: https://hetzner.cloud/?ref=your-ref
```

**DigitalOcean**:
```bash
# Basic Droplet: 2 vCPU, 2GB RAM, 50GB SSD - $12/месяц
# Регистрация: https://digitalocean.com
```

**Vultr**:
```bash
# High Frequency: 1 vCPU, 1GB RAM, 25GB SSD - $6/месяц
# Регистрация: https://vultr.com
```

#### Пошаговая настройка сервера

1. **Создание VPS**:
   - Выберите Ubuntu 24.04 LTS
   - Минимум 2GB RAM
   - Добавьте SSH ключ

2. **Подключение к серверу**:
   ```bash
   ssh root@YOUR_SERVER_IP
   ```

3. **Запуск скрипта установки**:
   ```bash
   wget https://raw.githubusercontent.com/your-repo/secure-vpn-app/main/server-setup/setup_vpn_server.sh
   chmod +x setup_vpn_server.sh
   sudo bash setup_vpn_server.sh
   ```

4. **Настройка домена** (опционально):
   ```bash
   # Добавьте A-запись в DNS вашего домена
   # example.com -> YOUR_SERVER_IP
   
   # Отредактируйте скрипт перед запуском
   nano setup_vpn_server.sh
   # Измените: DOMAIN="your-domain.com"
   # Измените: EMAIL="your-email@domain.com"
   ```

#### Альтернативная установка через Docker

```bash
# Клонирование конфигурации
git clone https://github.com/your-username/secure-vpn-app.git
cd secure-vpn-app/server-setup/docker

# Настройка переменных окружения
cp .env.example .env
nano .env  # Отредактируйте переменные

# Запуск через Docker Compose
docker-compose up -d

# Проверка логов
docker-compose logs -f
```

### 3. Сборка мобильного приложения

#### Сборка для Android

```bash
# Подготовка к сборке
npm install -g eas-cli
eas login

# Настройка проекта
eas build:configure

# Сборка APK (для тестирования)
eas build --platform android --profile preview

# Сборка AAB (для Google Play)
eas build --platform android --profile production
```

#### Сборка для iOS

```bash
# Требуется macOS и аккаунт Apple Developer

# Сборка для симулятора
eas build --platform ios --profile preview

# Сборка для App Store
eas build --platform ios --profile production
```

### 4. Развертывание веб-версии

#### Развертывание на Vercel

```bash
# Установка Vercel CLI
npm install -g vercel

# Сборка для веба
npm run build:web

# Развертывание
vercel --prod
```

#### Развертывание на Netlify

```bash
# Сборка
npm run build:web

# Перетащите папку web-build на netlify.com
# или используйте Netlify CLI
```

## 🔧 Конфигурация

### Настройки приложения

Основные настройки находятся в файле `src/constants/index.ts`:

```typescript
export const APP_CONFIG = {
  // Supabase конфигурация
  SUPABASE_URL: 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: 'your-anon-key',
  
  // API endpoints
  API_BASE_URL: 'https://api.your-domain.com',
  
  // Лимиты
  FREE_DATA_LIMIT: 10 * 1024 * 1024 * 1024, // 10GB
  MAX_DEVICES_FREE: 1,
  MAX_DEVICES_PREMIUM: 5,
};
```

### Настройки сервера

Конфигурация сервера в файлах:

- **WireGuard**: `/etc/wireguard/wg0.conf`
- **ShadowSocks**: `/etc/shadowsocks/config.json`
- **Xray**: `/usr/local/etc/xray/config.json`
- **API**: `/opt/securevpn-api/app.py`

## 📊 Мониторинг и логи

### Системные логи

```bash
# Логи VPN служб
journalctl -u wireguard -f
journalctl -u shadowsocks -f
journalctl -u xray -f

# Логи API
journalctl -u securevpn-api -f

# Общий лог установки
tail -f /var/log/securevpn-setup.log
```

### Веб-мониторинг

- **Grafana**: `http://YOUR_SERVER_IP:3000`
- **Prometheus**: `http://YOUR_SERVER_IP:9090`
- **Pi-hole**: `http://YOUR_SERVER_IP/admin`

### API мониторинг

```bash
# Статус системы
curl http://YOUR_SERVER_IP:8080/api/system/status

# Здоровье API
curl http://YOUR_SERVER_IP:8080/api/health

# Prometheus метрики
curl http://YOUR_SERVER_IP:8080/metrics
```

## 🛡️ Безопасность

### Рекомендации по безопасности

1. **Измените пароли по умолчанию**:
   ```bash
   # Пароль ShadowSocks
   cat /etc/shadowsocks/password.txt
   
   # Пароль Pi-hole
   cat /etc/pihole/web_password.txt
   
   # Данные Xray
   cat /usr/local/etc/xray/client_info.txt
   ```

2. **Настройте файрвол**:
   ```bash
   # Проверка статуса UFW
   ufw status verbose
   
   # Дополнительные правила
   ufw allow from TRUSTED_IP to any port 22
   ```

3. **Регулярные обновления**:
   ```bash
   # Обновление системы
   apt update && apt upgrade -y
   
   # Обновление Docker образов
   docker-compose pull && docker-compose up -d
   ```

### Защита от DDoS

```bash
# Установка Fail2Ban (уже включен в скрипт)
systemctl status fail2ban

# Проверка заблокированных IP
fail2ban-client status
```

## 🧪 Тестирование

### Тестирование приложения

```bash
# Юнит тесты
npm test

# Тесты интеграции
npm run test:integration

# E2E тесты
npm run test:e2e

# Покрытие кода
npm run test:coverage
```

### Тестирование сервера

```bash
# Тест подключения WireGuard
wg show

# Тест ShadowSocks
ss -tulpn | grep 8388

# Тест Xray
systemctl status xray

# Тест скорости
speedtest-cli
```

## 📞 Поддержка и устранение проблем

### Частые проблемы

#### Приложение не подключается к серверу

```bash
# Проверка портов на сервере
netstat -tulpn | grep -E '(51820|8388|443|8080)'

# Проверка файрвола
ufw status

# Перезапуск служб
systemctl restart wireguard shadowsocks xray
```

#### Низкая скорость VPN

```bash
# Оптимизация TCP
echo 'net.core.default_qdisc=fq' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_congestion_control=bbr' >> /etc/sysctl.conf
sysctl -p

# Перезапуск сетевых служб
systemctl restart networking
```

#### Проблемы с DNS

```bash
# Проверка Pi-hole
systemctl status pihole-FTL

# Тест DNS резолвинга
nslookup google.com 127.0.0.1

# Очистка DNS кэша
systemctl restart systemd-resolved
```

### Получение помощи

- **GitHub Issues**: [Создать issue](https://github.com/your-username/secure-vpn-app/issues)
- **Telegram**: [@SecureVPNSupport](https://t.me/SecureVPNSupport)
- **Email**: support@your-domain.com

## 📈 Производительность

### Оптимизация сервера

```bash
# Для серверов с >10,000 пользователей
echo 'net.core.rmem_max = 134217728' >> /etc/sysctl.conf
echo 'net.core.wmem_max = 134217728' >> /etc/sysctl.conf
echo 'net.ipv4.udp_mem = 102400 873800 16777216' >> /etc/sysctl.conf
sysctl -p
```

### Масштабирование

```bash
# Горизонтальное масштабирование с Docker Swarm
docker swarm init
docker service create --replicas 3 securevpn-api

# Балансировка нагрузки с HAProxy
apt install haproxy
# Конфигурация в /etc/haproxy/haproxy.cfg
```

## 📄 Лицензия

Этот проект лицензирован под MIT License. См. файл [LICENSE](LICENSE) для подробностей.

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие проекта! См. [CONTRIBUTING.md](CONTRIBUTING.md) для инструкций.

### Как внести вклад

1. **Fork** репозиторий
2. **Создайте** ветку для новой функции (`git checkout -b feature/AmazingFeature`)
3. **Commit** изменения (`git commit -m 'Add some AmazingFeature'`)
4. **Push** в ветку (`git push origin feature/AmazingFeature`)
5. **Создайте** Pull Request

## 🙏 Благодарности

- **WireGuard** за отличный VPN протокол
- **Shadowsocks** за обход блокировок
- **Xray Project** за VLESS+Reality
- **React Native** команда за кроссплатформенность
- **Expo** за простоту разработки
- **Pi-hole** за DNS защиту

## 📊 Статистика проекта

![GitHub stars](https://img.shields.io/github/stars/your-username/secure-vpn-app)
![GitHub forks](https://img.shields.io/github/forks/your-username/secure-vpn-app)
![GitHub issues](https://img.shields.io/github/issues/your-username/secure-vpn-app)
![GitHub license](https://img.shields.io/github/license/your-username/secure-vpn-app)

---

**SecureVPN** - Ваша приватность важна! 🔒

*Создано с ❤️ командой SecureVPN*