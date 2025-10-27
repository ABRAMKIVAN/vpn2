import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createThemedStyles, getConnectionStatusColor } from '../utils/theme';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

interface ConnectionStatusProps {
  status: ConnectionStatus;
  serverName?: string;
  protocol: 'wireguard' | 'shadowsocks' | 'vless';
  ipAddress?: string;
  connectionTime?: string;
  style?: ViewStyle;
}

export const ConnectionStatusCard: React.FC<ConnectionStatusProps> = ({
  status,
  serverName,
  protocol,
  ipAddress,
  connectionTime,
  style,
}) => {
  const { theme } = useTheme();
  const styles = createThemedStyles(theme, createStyles);

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Подключено';
      case 'connecting':
        return 'Подключение...';
      default:
        return 'Отключено';
    }
  };

  const getProtocolIcon = () => {
    switch (protocol) {
      case 'wireguard':
        return '🚀';
      case 'shadowsocks':
        return '🎭';
      case 'vless':
        return '👻';
      default:
        return '🔧';
    }
  };

  const getProtocolName = () => {
    switch (protocol) {
      case 'wireguard':
        return 'WireGuard';
      case 'shadowsocks':
        return 'ShadowSocks';
      case 'vless':
        return 'VLESS Reality';
      default:
        return 'Неизвестный';
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Header with status */}
      <View style={styles.header}>
        <View style={styles.statusIndicator}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getConnectionStatusColor(theme, status) },
            ]}
          />
        </View>
        <View style={styles.statusInfo}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
          {serverName && (
            <Text style={styles.serverText}>{serverName}</Text>
          )}
        </View>
      </View>

      {/* Connection details */}
      {status === 'connected' && (
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Протокол:</Text>
            <View style={styles.protocolInfo}>
              <Text style={styles.protocolIcon}>{getProtocolIcon()}</Text>
              <Text style={styles.detailValue}>{getProtocolName()}</Text>
            </View>
          </View>

          {ipAddress && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>IP адрес:</Text>
              <Text style={styles.detailValue}>{ipAddress}</Text>
            </View>
          )}

          {connectionTime && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Время:</Text>
              <Text style={styles.detailValue}>{connectionTime}</Text>
            </View>
          )}
        </View>
      )}

      {/* Connection stats */}
      {status === 'connected' && (
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>245</Text>
            <Text style={styles.statLabel}>Mbps</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>23</Text>
            <Text style={styles.statLabel}>ms</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0.1%</Text>
            <Text style={styles.statLabel}>Потери</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: typeof import('../types/theme').ThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIndicator: {
    marginRight: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusInfo: {
    flex: 1,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  serverText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  details: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  protocolInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  protocolIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
});