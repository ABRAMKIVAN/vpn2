// Основные типы для VPN приложения

export interface VPNServer {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  city: string;
  latitude: number;
  longitude: number;
  load: number; // Загрузка сервера 0-100%
  ping: number; // Пинг в ms
  premium: boolean;
  protocols: VPNProtocol[];
  endpoint: string;
}

export type VPNProtocol = 'wireguard' | 'shadowsocks' | 'vless-reality';

export interface VPNConnection {
  id: string;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  server?: VPNServer;
  protocol?: VPNProtocol;
  connectedAt?: Date;
  duration?: number;
  bytesReceived: number;
  bytesSent: number;
  publicIP?: string;
  localIP?: string;
}

export interface UserSettings {
  darkMode: boolean;
  autoConnect: boolean;
  killSwitch: boolean;
  dnsProtection: boolean;
  protocol: VPNProtocol;
  autoProtocol: boolean;
  notifications: boolean;
  speedAlerts: boolean;
  language: 'ru' | 'en';
}

export interface UserProfile {
  id: string;
  isAnonymous: boolean;
  isPremium: boolean;
  dataUsage: number;
  devicesConnected: number;
  createdAt: Date;
  settings: UserSettings;
}

export interface SpeedTestResult {
  downloadSpeed: number; // Mbps
  uploadSpeed: number; // Mbps
  ping: number; // ms
  timestamp: Date;
  serverId: string;
}

export interface NetworkStatus {
  isConnected: boolean;
  connectionType: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
  isVpnActive: boolean;
  publicIP?: string;
  location?: {
    country: string;
    city: string;
    latitude: number;
    longitude: number;
  };
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onPress: () => void;
  };
}