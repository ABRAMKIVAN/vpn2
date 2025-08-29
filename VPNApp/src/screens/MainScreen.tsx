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

      {/* Connection Status */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: getConnectionStatusColor(theme, getConnectionStatus()) }]} />
        <Text style={styles.statusText}>
          {getConnectionStatus().charAt(0).toUpperCase() + getConnectionStatus().slice(1)}
        </Text>
        {connectionState.currentServer && (
          <Text style={styles.serverText}>
            {connectionState.currentServer.city}, {connectionState.currentServer.country}
          </Text>
        )}
      </View>

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
    paddingHorizontal: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: colors.surface,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  serverText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  connectionButton: {
    marginBottom: 30,
  },
  speedDisplay: {
    marginBottom: 30,
  },
  countrySelector: {
    marginBottom: 30,
  },
  settingsPanel: {
    marginBottom: 30,
  },
  serverList: {
    marginBottom: 30,
  },
  notificationCenter: {
    marginBottom: 50,
  },
});