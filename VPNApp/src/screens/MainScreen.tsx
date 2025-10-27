import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createThemedStyles, getConnectionStatusColor } from '../utils/theme';
import { ConnectionButton } from '../components/ConnectionButton';
import { ThemeColors } from '../types/theme';
import { CountrySelector } from '../components/CountrySelector';
import { SpeedDisplay } from '../components/SpeedDisplay';
import { SettingsPanel } from '../components/SettingsPanel';
import { NotificationCenter } from '../components/NotificationCenter';
import { ServerList } from '../components/ServerList';
import { ConnectionStatusCard } from '../components/ConnectionStatus';
import { QuickActions } from '../components/QuickActions';
import { UsageStats } from '../components/UsageStats';
import { vpnService } from '../services/vpnService';
import { Server } from '../types/server';

// Types
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';
type ProtocolType = 'wireguard' | 'shadowsocks' | 'vless';

export const MainScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = createThemedStyles(theme, createStyles);

  // State management
  const [connectionState, setConnectionState] = useState(vpnService.getConnectionState());
  const [availableServers, setAvailableServers] = useState<Server[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('US');
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolType>('wireguard');
  const [killSwitchEnabled, setKillSwitchEnabled] = useState(false);
  const [dnsProtectionEnabled, setDnsProtectionEnabled] = useState(true);
  const [autoProtocolEnabled, setAutoProtocolEnabled] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionTime, setConnectionTime] = useState('00:00:00');

  // Mock usage stats
  const usageStats = {
    totalData: '1.2 GB',
    sessionData: '245 MB',
    sessionTime: connectionTime,
    savedData: '89%',
  };

  // Initialize VPN service and load servers
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load available servers
        const servers = await vpnService.getAvailableServers();
        setAvailableServers(servers);

        // Subscribe to VPN state changes
        const unsubscribe = vpnService.onStateChange((newState) => {
          setConnectionState(newState);

          // Map VPN service state to our component state
          const status: ConnectionStatus = newState.isConnecting
            ? 'connecting'
            : newState.isConnected
            ? 'connected'
            : 'disconnected';

          // Add notifications for state changes
          if (newState.isConnected && !connectionState.isConnected) {
            addNotification(`Connected to ${newState.currentServer?.city}, ${newState.currentServer?.country}`);
          } else if (!newState.isConnected && connectionState.isConnected) {
            addNotification('Disconnected from VPN');
          }
        });

        // Load initial IP
        const ipInfo = await vpnService.getCurrentIP();
        setConnectionState(prev => ({ ...prev, ipAddress: ipInfo.ip }));

        setIsLoading(false);

        return unsubscribe;
      } catch (error) {
        console.error('Failed to initialize app:', error);
        addNotification('Failed to load server list');
        setIsLoading(false);
      }
    };

    const cleanup = initializeApp();
    return () => {
      cleanup?.then(unsubscribe => unsubscribe?.());
    };
  }, []);

  // Handle connect/disconnect
  const handleConnect = async () => {
    try {
      if (connectionState.isConnected) {
        await vpnService.disconnect();
      } else {
        const selectedServer = availableServers.find(s => s.countryCode === selectedCountry) || availableServers[0];
        if (selectedServer) {
          addNotification('Connecting to VPN...');
          await vpnService.connect(selectedServer.id);
        }
      }
    } catch (error) {
      Alert.alert('Connection Error', error instanceof Error ? error.message : 'Failed to connect');
      addNotification('Connection failed');
    }
  };

  const addNotification = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const notification = `[${timestamp}] ${message}`;
    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10 notifications
  };

  // Update VPN service settings when they change
  useEffect(() => {
    vpnService.updateSettings({
      selectedProtocol,
      killSwitchEnabled,
      dnsProtectionEnabled,
      autoProtocolEnabled,
    });
  }, [selectedProtocol, killSwitchEnabled, dnsProtectionEnabled, autoProtocolEnabled]);

  // Connection timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (connectionState.isConnected) {
      let seconds = 0;
      interval = setInterval(() => {
        seconds++;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        setConnectionTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        );
      }, 1000);
    } else {
      setConnectionTime('00:00:00');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [connectionState.isConnected]);

  // Quick actions
  const quickActions = [
    {
      id: 'speed-test',
      icon: '⚡',
      label: 'Тест скорости',
      onPress: () => addNotification('Запуск теста скорости...'),
    },
    {
      id: 'kill-switch',
      icon: killSwitchEnabled ? '🛡️' : '⚠️',
      label: killSwitchEnabled ? 'Kill Switch ON' : 'Kill Switch OFF',
      onPress: () => setKillSwitchEnabled(!killSwitchEnabled),
      badge: killSwitchEnabled ? '' : '!',
    },
    {
      id: 'servers',
      icon: '🌍',
      label: 'Серверы',
      onPress: () => addNotification('Открытие списка серверов...'),
    },
    {
      id: 'settings',
      icon: '⚙️',
      label: 'Настройки',
      onPress: () => addNotification('Открытие настроек...'),
    },
    {
      id: 'support',
      icon: '💬',
      label: 'Поддержка',
      onPress: () => addNotification('Связь с поддержкой...'),
    },
    {
      id: 'stats',
      icon: '📊',
      label: 'Статистика',
      onPress: () => addNotification('Просмотр статистики...'),
    },
  ];

  // Determine connection status for components
  const getConnectionStatus = (): ConnectionStatus => {
    if (connectionState.isConnecting) return 'connecting';
    if (connectionState.isConnected) return 'connected';
    return 'disconnected';
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading VPN servers...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>SecureVPN</Text>
        <Text style={styles.subtitle}>Fast • Secure • Private</Text>
      </View>

      {/* Connection Status Card */}
      <ConnectionStatusCard
        status={getConnectionStatus()}
        serverName={connectionState.currentServer ? `${connectionState.currentServer.city}, ${connectionState.currentServer.country}` : undefined}
        protocol={selectedProtocol}
        ipAddress={connectionState.ipAddress}
        connectionTime={connectionTime}
        style={styles.connectionStatusCard}
      />

      {/* Connection Button */}
      <ConnectionButton
        status={getConnectionStatus()}
        onPress={handleConnect}
        style={styles.connectionButton}
      />

      {/* Speed Display */}
      <SpeedDisplay
        downloadSpeed={connectionState.downloadSpeed}
        uploadSpeed={connectionState.uploadSpeed}
        ipAddress={connectionState.ipAddress}
        style={styles.speedDisplay}
      />

      {/* Quick Actions */}
      <QuickActions
        actions={quickActions}
        style={styles.quickActions}
      />

      {/* Usage Stats */}
      <UsageStats
        totalData={usageStats.totalData}
        sessionData={usageStats.sessionData}
        sessionTime={usageStats.sessionTime}
        savedData={usageStats.savedData}
        style={styles.usageStats}
      />

      {/* Country Selection */}
      <CountrySelector
        selectedCountry={selectedCountry}
        onCountrySelect={setSelectedCountry}
        servers={availableServers}
        style={styles.countrySelector}
      />

      {/* Settings Panel */}
      <SettingsPanel
        selectedProtocol={selectedProtocol}
        onProtocolChange={setSelectedProtocol}
        killSwitchEnabled={killSwitchEnabled}
        onKillSwitchToggle={setKillSwitchEnabled}
        dnsProtectionEnabled={dnsProtectionEnabled}
        onDnsProtectionToggle={setDnsProtectionEnabled}
        autoProtocolEnabled={autoProtocolEnabled}
        onAutoProtocolToggle={setAutoProtocolEnabled}
        style={styles.settingsPanel}
      />

      {/* Server List */}
      <ServerList
        servers={availableServers}
        selectedServerId={connectionState.currentServer?.id}
        onServerSelect={(server) => setSelectedCountry(server.countryCode)}
        style={styles.serverList}
      />

      {/* Notification Center */}
      <NotificationCenter
        notifications={notifications}
        style={styles.notificationCenter}
      />
    </ScrollView>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '400',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
    paddingHorizontal: 24,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.25,
  },
  serverText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  connectionStatusCard: {
    marginBottom: 32,
  },
  connectionButton: {
    marginBottom: 32,
  },
  speedDisplay: {
    marginBottom: 32,
  },
  quickActions: {
    marginBottom: 32,
  },
  usageStats: {
    marginBottom: 32,
  },
  countrySelector: {
    marginBottom: 32,
  },
  settingsPanel: {
    marginBottom: 32,
  },
  serverList: {
    marginBottom: 32,
  },
  notificationCenter: {
    marginBottom: 24,
  },
});