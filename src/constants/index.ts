// Константы приложения

export const APP_CONFIG = {
  NAME: 'SecureVPN',
  VERSION: '1.0.0',
  BUILD: 1,
  
  // Supabase конфигурация
  SUPABASE_URL: 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: 'your-anon-key',
  
  // API endpoints
  API_BASE_URL: 'https://api.securevpn.com',
  SPEED_TEST_URL: 'https://speedtest.securevpn.com',
  
  // Limits
  FREE_DATA_LIMIT: 10 * 1024 * 1024 * 1024, // 10GB в байтах
  MAX_DEVICES_FREE: 1,
  MAX_DEVICES_PREMIUM: 5,
  
  // Timeouts
  CONNECTION_TIMEOUT: 30000, // 30 секунд
  PING_TIMEOUT: 5000, // 5 секунд
  SPEED_TEST_TIMEOUT: 30000, // 30 секунд
};

export const VPN_PROTOCOLS = {
  WIREGUARD: {
    name: 'WireGuard',
    description: 'Быстрый и безопасный современный протокол',
    icon: 'shield-fast',
    defaultPort: 51820,
    features: ['Высокая скорость', 'Низкое энергопотребление', 'Современная криптография'],
  },
  SHADOWSOCKS: {
    name: 'ShadowSocks',
    description: 'Обфускация для обхода блокировок',
    icon: 'eye-off',
    defaultPort: 8388,
    features: ['Обход блокировок', 'Обфускация трафика', 'Низкая детектируемость'],
  },
  VLESS_REALITY: {
    name: 'VLESS+Reality',
    description: 'Анти-детекция с TLS шифрованием',
    icon: 'shield-lock',
    defaultPort: 443,
    features: ['Максимальная скрытность', 'TLS шифрование', 'Анти-детекция'],
  },
} as const;

export const COUNTRIES = [
  { code: 'US', name: 'США', flag: '🇺🇸' },
  { code: 'GB', name: 'Великобритания', flag: '🇬🇧' },
  { code: 'DE', name: 'Германия', flag: '🇩🇪' },
  { code: 'FR', name: 'Франция', flag: '🇫🇷' },
  { code: 'NL', name: 'Нидерланды', flag: '🇳🇱' },
  { code: 'JP', name: 'Япония', flag: '🇯🇵' },
  { code: 'SG', name: 'Сингапур', flag: '🇸🇬' },
  { code: 'CA', name: 'Канада', flag: '🇨🇦' },
  { code: 'AU', name: 'Австралия', flag: '🇦🇺' },
  { code: 'CH', name: 'Швейцария', flag: '🇨🇭' },
] as const;

export const THEMES = {
  LIGHT: {
    name: 'Светлая тема',
    colors: {
      background: '#f5f5f5',
      surface: '#ffffff',
      primary: '#0ea5e9',
      text: '#171717',
      textSecondary: '#737373',
      border: '#e5e5e5',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
    },
  },
  DARK: {
    name: 'Темная тема',
    colors: {
      background: '#171717',
      surface: '#262626',
      primary: '#0ea5e9',
      text: '#fafafa',
      textSecondary: '#a3a3a3',
      border: '#404040',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
    },
  },
} as const;

export const NOTIFICATION_TYPES = {
  CONNECTION_SUCCESS: 'Успешное подключение к VPN',
  CONNECTION_FAILED: 'Ошибка подключения к VPN',
  DISCONNECTED: 'VPN отключен',
  KILL_SWITCH_ACTIVATED: 'Kill Switch активирован',
  SPEED_ALERT: 'Низкая скорость соединения',
  DATA_LIMIT_WARNING: 'Превышен лимит трафика',
  SERVER_MAINTENANCE: 'Техническое обслуживание сервера',
} as const;

export const ANIMATIONS = {
  SPRING_CONFIG: {
    damping: 15,
    stiffness: 150,
  },
  TIMING_CONFIG: {
    duration: 300,
  },
  CONNECTION_PULSE: {
    duration: 2000,
    iterations: -1,
  },
} as const;