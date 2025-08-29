const express = require('express');
const path = require('path');
const http = require('http');
const fs = require('fs');

const app = express();
const port = 3000;

// Обслуживание статических файлов
app.use(express.static(path.join(__dirname)));

// Главная страница
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    fs.readFile(indexPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Ошибка загрузки страницы');
            return;
        }
        res.send(data);
    });
});

// Прокси для Metro bundler
app.get('/metro/*', (req, res) => {
    const metroUrl = `http://localhost:8081${req.path.replace('/metro', '')}`;
    res.redirect(metroUrl);
});

// API статус
app.get('/api/status', (req, res) => {
    res.json({
        status: 'running',
        app: 'SecureVPN',
        version: '1.0.0',
        metro: 'http://localhost:8081',
        timestamp: new Date().toISOString()
    });
});

// Проверка статуса Metro
app.get('/status/metro', (req, res) => {
    const options = {
        hostname: 'localhost',
        port: 8081,
        path: '/status',
        method: 'GET'
    };

    const metroReq = http.request(options, (metroRes) => {
        let data = '';
        metroRes.on('data', (chunk) => {
            data += chunk;
        });
        metroRes.on('end', () => {
            res.json({
                metro: 'running',
                data: data
            });
        });
    });

    metroReq.on('error', (err) => {
        res.json({
            metro: 'not_running',
            error: err.message
        });
    });

    metroReq.end();
});

const server = app.listen(port, () => {
    console.log('🚀 ======================================');
    console.log('🚀 SecureVPN веб-сервер запущен!');
    console.log('🚀 ======================================');
    console.log(`📱 Главная страница: http://localhost:${port}`);
    console.log(`🔗 Metro Bundler: http://localhost:8081`);
    console.log(`📊 API статус: http://localhost:${port}/api/status`);
    console.log(`🔍 Metro статус: http://localhost:${port}/status/metro`);
    console.log('');
    console.log('💡 ОТКРОЙТЕ В БРАУЗЕРЕ:');
    console.log(`   http://localhost:${port}`);
    console.log('======================================');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Останавливаем сервер...');
    server.close(() => {
        console.log('✅ Сервер остановлен');
        process.exit(0);
    });
});