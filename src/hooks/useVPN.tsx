import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { VPNConnection, VPNServer, VPNProtocol, NetworkStatus } from '../types';

interface VPNContextType {
  connection: VPNConnection;
  networkStatus: NetworkStatus;
  servers: VPNServer[];
  isLoading: boolean;
  connect: (server: VPNServer, protocol?: VPNProtocol) => Promise<void>;
  disconnect: () => Promise<void>;
  switchServer: (server: VPNServer) => Promise<void>;
  testServerPing: (server: VPNServer) => Promise<number>;
  getLocationInfo: () => Promise<void>;
}

const VPNContext = createContext<VPNContextType | undefined>(undefined);

interface VPNProviderProps {
  children: ReactNode;
}

export function VPNProvider({ children }: VPNProviderProps) {
  const [connection, setConnection] = useState<VPNConnection>({
    id: '',
    status: 'disconnected',
    bytesReceived: 0,
    bytesSent: 0,
  });

  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: false,
    connectionType: 'unknown',
    isVpnActive: false,
  });

  const [servers, setServers] = useState<VPNServer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeVPN();
    setupNetworkListener();
  }, []);

  const initializeVPN = async () => {
    try {
      await loadServers();
      await getLocationInfo();
    } catch (error) {
      console.error('Ошибка инициализации VPN:', error);
    }
  };

  const setupNetworkListener = () => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkStatus(prev => ({
        ...prev,
        isConnected: state.isConnected ?? false,
        connectionType: state.type as any,
      }));
    });

    return unsubscribe;
  };

  const loadServers = async () => {
    try {
      // Моковые серверы для демонстрации
      const mockServers: VPNServer[] = [
        {
          id: 'us-ny-01',
          name: 'Нью-Йорк #1',
          country: 'США',
          countryCode: 'US',
          city: 'Нью-Йорк',
          latitude: 40.7128,
          longitude: -74.0060,
          load: 45,
          ping: 25,
          premium: false,
          protocols: ['wireguard', 'shadowsocks', 'vless-reality'],
          endpoint: 'us-ny-01.securevpn.com',
        },
        {
          id: 'de-fra-01',
          name: 'Франкфурт #1',
          country: 'Германия',
          countryCode: 'DE',
          city: 'Франкфурт',
          latitude: 50.1109,
          longitude: 8.6821,
          load: 32,
          ping: 15,
          premium: false,
          protocols: ['wireguard', 'shadowsocks', 'vless-reality'],
          endpoint: 'de-fra-01.securevpn.com',
        },
        {
          id: 'jp-tok-01',
          name: 'Токио #1',
          country: 'Япония',
          countryCode: 'JP',
          city: 'Токио',
          latitude: 35.6762,
          longitude: 139.6503,
          load: 67,
          ping: 120,
          premium: true,
          protocols: ['wireguard', 'shadowsocks', 'vless-reality'],
          endpoint: 'jp-tok-01.securevpn.com',
        },
        {
          id: 'sg-sin-01',
          name: 'Сингапур #1',
          country: 'Сингапур',
          countryCode: 'SG',
          city: 'Сингапур',
          latitude: 1.3521,
          longitude: 103.8198,
          load: 23,
          ping: 89,
          premium: true,
          protocols: ['wireguard', 'vless-reality'],
          endpoint: 'sg-sin-01.securevpn.com',
        },
        {
          id: 'nl-ams-01',
          name: 'Амстердам #1',
          country: 'Нидерланды',
          countryCode: 'NL',
          city: 'Амстердам',
          latitude: 52.3676,
          longitude: 4.9041,
          load: 58,
          ping: 18,
          premium: false,
          protocols: ['wireguard', 'shadowsocks'],
          endpoint: 'nl-ams-01.securevpn.com',
        },
      ];

      setServers(mockServers);
    } catch (error) {
      console.error('Ошибка загрузки серверов:', error);
    }
  };

  const connect = async (server: VPNServer, protocol: VPNProtocol = 'wireguard') => {
    try {
      setIsLoading(true);
      setConnection(prev => ({
        ...prev,
        status: 'connecting',
        server,
        protocol,
      }));

      // Симуляция подключения
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newConnection: VPNConnection = {
        id: `conn_${Date.now()}`,
        status: 'connected',
        server,
        protocol,
        connectedAt: new Date(),
        bytesReceived: 0,
        bytesSent: 0,
        publicIP: '198.51.100.1', // Моковый IP
        localIP: '10.0.0.2',
      };

      setConnection(newConnection);
      setNetworkStatus(prev => ({
        ...prev,
        isVpnActive: true,
        publicIP: newConnection.publicIP,
        location: {
          country: server.country,
          city: server.city,
          latitude: server.latitude,
          longitude: server.longitude,
        },
      }));

      console.log(`Подключено к серверу: ${server.name} через ${protocol}`);
    } catch (error) {
      console.error('Ошибка подключения:', error);
      setConnection(prev => ({
        ...prev,
        status: 'error',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      setIsLoading(true);
      setConnection(prev => ({
        ...prev,
        status: 'disconnected',
        server: undefined,
        protocol: undefined,
        connectedAt: undefined,
        publicIP: undefined,
        localIP: undefined,
      }));

      setNetworkStatus(prev => ({
        ...prev,
        isVpnActive: false,
        publicIP: undefined,
        location: undefined,
      }));

      console.log('VPN отключен');
    } catch (error) {
      console.error('Ошибка отключения:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchServer = async (server: VPNServer) => {
    if (connection.status === 'connected') {
      await disconnect();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await connect(server, connection.protocol);
    }
  };

  const testServerPing = async (server: VPNServer): Promise<number> => {
    try {
      const startTime = Date.now();
      // Симуляция ping теста
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
      const endTime = Date.now();
      const ping = endTime - startTime + Math.random() * 50;
      
      // Обновляем пинг сервера
      setServers(prev => prev.map(s => 
        s.id === server.id ? { ...s, ping: Math.round(ping) } : s
      ));
      
      return Math.round(ping);
    } catch (error) {
      console.error('Ошибка ping теста:', error);
      return -1;
    }
  };

  const getLocationInfo = async () => {
    try {
      // Симуляция получения информации о локации
      const mockLocation = {
        country: 'Россия',
        city: 'Москва',
        latitude: 55.7558,
        longitude: 37.6173,
      };

      setNetworkStatus(prev => ({
        ...prev,
        publicIP: '85.143.195.123', // Моковый IP
        location: mockLocation,
      }));
    } catch (error) {
      console.error('Ошибка получения геолокации:', error);
    }
  };

  const value: VPNContextType = {
    connection,
    networkStatus,
    servers,
    isLoading,
    connect,
    disconnect,
    switchServer,
    testServerPing,
    getLocationInfo,
  };

  return (
    <VPNContext.Provider value={value}>
      {children}
    </VPNContext.Provider>
  );
}

export function useVPN(): VPNContextType {
  const context = useContext(VPNContext);
  if (context === undefined) {
    throw new Error('useVPN должен использоваться внутри VPNProvider');
  }
  return context;
}