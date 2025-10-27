#!/bin/bash

echo "🚀 Запуск VPN приложения..."
echo "====================================="

# Функция для проверки доступности порта
check_port() {
    local port=$1
    local timeout=5
    if timeout $timeout bash -c "echo > /dev/tcp/localhost/$port" 2>/dev/null; then
        echo "✅ Порт $port занят"
        return 0
    else
        echo "❌ Порт $port свободен"
        return 1
    fi
}

# Функция для запуска сервиса в фоне
start_service() {
    local name=$1
    local command=$2
    local log_file=$3

    echo "🔧 Запускаю $name..."
    eval "$command > $log_file 2>&1 &"
    local pid=$!
    echo "$name запущен с PID: $pid"

    # Ждем немного и проверяем
    sleep 3
    if kill -0 $pid 2>/dev/null; then
        echo "✅ $name успешно запущен"
    else
        echo "❌ $name не запустился"
        return 1
    fi

    return 0
}

# Очищаем предыдущие логи
rm -f metro.log webserver.log

echo ""
echo "🌐 Запуск веб-сервера (порт 8000)..."
python3 -m http.server 8000 > webserver.log 2>&1 &
WEBSERVER_PID=$!
echo "Веб-сервер запущен с PID: $WEBSERVER_PID"

echo ""
echo "🚀 Запуск Metro Bundler (порт 8081)..."
npx react-native start --reset-cache --port=8081 > metro.log 2>&1 &
METRO_PID=$!
echo "Metro Bundler запущен с PID: $METRO_PID"

echo ""
echo "⏳ Ждем запуска сервисов..."
sleep 5

echo ""
echo "🔍 Проверяем статус сервисов:"

# Проверяем веб-сервер
if curl -s --connect-timeout 3 http://localhost:8000 > /dev/null 2>&1; then
    echo "✅ Веб-сервер работает: http://localhost:8000"
else
    echo "❌ Веб-сервер не отвечает"
fi

# Проверяем Metro bundler
if curl -s --connect-timeout 3 http://localhost:8081 > /dev/null 2>&1; then
    echo "✅ Metro Bundler работает: http://localhost:8081"
else
    echo "❌ Metro Bundler не отвечает"
fi

echo ""
echo "====================================="
echo "🎉 СЕРВИСЫ ЗАПУЩЕНЫ!"
echo ""
echo "📱 Откройте в браузере:"
echo "   http://localhost:8000"
echo ""
echo "🚀 Или напрямую приложение:"
echo "   http://localhost:8081"
echo ""
echo "🛑 Для остановки нажмите Ctrl+C"
echo "====================================="

# Ждем завершения
wait