# 🚀 Быстрый старт SecureVPN

## Для не-программистов

### 1️⃣ Запуск приложения на компьютере (5 минут)

**Windows:**
```bash
# Открыть PowerShell как Администратор
winget install OpenJS.NodeJS
npm install -g @expo/cli

# Скачать проект
git clone https://github.com/your-username/secure-vpn-app.git
cd secure-vpn-app

# Установить и запустить
npm install
npm start
```

**macOS:**
```bash
# Открыть Terminal
brew install node
npm install -g @expo/cli

# Скачать проект  
git clone https://github.com/your-username/secure-vpn-app.git
cd secure-vpn-app

# Установить и запустить
npm install
npm start
```

**Ubuntu/Linux:**
```bash
# Открыть Terminal
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g @expo/cli

# Скачать проект
git clone https://github.com/your-username/secure-vpn-app.git
cd secure-vpn-app

# Установить и запустить
npm install
npm start
```

### 2️⃣ Тестирование на телефоне (2 минуты)

1. Установите **Expo Go** из App Store или Google Play
2. Отсканируйте QR-код который появится в терминале
3. Приложение откроется на вашем телефоне

### 3️⃣ Настройка VPN сервера (10 минут)

**Получение VPS:**
- Зарегистрируйтесь на [Hetzner Cloud](https://hetzner.cloud) (€4/месяц)
- Или [DigitalOcean](https://digitalocean.com) ($12/месяц) 
- Выберите Ubuntu 24.04, минимум 2GB RAM

**Настройка сервера:**
```bash
# Подключитесь к серверу (замените IP)
ssh root@YOUR_SERVER_IP

# Скачайте и запустите скрипт
wget https://raw.githubusercontent.com/your-repo/secure-vpn-app/main/server-setup/setup_vpn_server.sh
chmod +x setup_vpn_server.sh
sudo bash setup_vpn_server.sh
```

**Ждите 5-10 минут** - скрипт автоматически установит:
- ✅ WireGuard VPN
- ✅ ShadowSocks  
- ✅ VLESS+Reality
- ✅ Pi-hole DNS защита
- ✅ Мониторинг и безопасность

### 4️⃣ Подключение приложения к серверу (2 минуты)

1. Откройте файл `src/constants/index.ts` в приложении
2. Замените `API_BASE_URL` на `http://YOUR_SERVER_IP:8080`
3. Сохраните и перезапустите приложение (`npm start`)
4. Теперь можно подключаться к своему VPN!

---

## Для программистов

### 🛠️ Разработка

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm start

# Платформо-специфичные команды
npm run android  # Android эмулятор
npm run ios      # iOS симулятор  
npm run web      # Веб браузер

# Тестирование
npm test         # Юнит тесты
npm run lint     # ESLint
npm run format   # Prettier
```

### 📱 Сборка для продакшена

```bash
# Настройка EAS Build
npm install -g eas-cli
eas login
eas build:configure

# Android
eas build --platform android --profile production

# iOS  
eas build --platform ios --profile production

# Web
npm run build:web
vercel --prod
```

### 🖥️ Сервер через Docker

```bash
cd server-setup/docker

# Настройка переменных
cp .env.example .env
nano .env

# Запуск
docker-compose up -d

# Логи
docker-compose logs -f
```

### 🧪 Тестирование

```bash
# Все тесты
npm test

# Покрытие кода
npm run test:coverage

# E2E тесты
npm run test:e2e

# Тест API
curl http://localhost:8080/api/health
```

---

## ⚡ Быстрые команды

| Действие | Команда |
|----------|---------|
| Запуск приложения | `npm start` |
| Установка сервера | `bash setup_vpn_server.sh` |
| Статус VPN | `systemctl status wireguard` |
| Логи сервера | `journalctl -u wireguard -f` |
| Создать клиента | `/opt/securevpn-api/create_wg_client.sh client1` |
| API статус | `curl http://SERVER_IP:8080/api/status` |
| Перезапуск VPN | `systemctl restart wireguard` |

---

## 🆘 Частые проблемы

**Приложение не запускается:**
```bash
# Очистить кэш
npm start -- --clear
expo start -c
```

**Сервер не подключается:**
```bash
# Проверить порты
netstat -tulpn | grep -E '(51820|8388|443)'

# Проверить файрвол
ufw status
```

**Низкая скорость VPN:**
```bash
# Оптимизация TCP
echo 'net.ipv4.tcp_congestion_control=bbr' >> /etc/sysctl.conf
sysctl -p
systemctl restart networking
```

---

## 📞 Поддержка

- 📋 **GitHub Issues**: [Создать issue](https://github.com/your-username/secure-vpn-app/issues)
- 💬 **Telegram**: [@SecureVPNSupport](https://t.me/SecureVPNSupport)  
- 📧 **Email**: support@your-domain.com

**Время ответа:** обычно в течение 24 часов

---

🎉 **Поздравляем!** Теперь у вас есть собственное VPN приложение и сервер!