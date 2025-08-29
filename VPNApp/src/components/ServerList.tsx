import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createThemedStyles } from '../utils/theme';
import { ThemeColors } from '../types/theme';

interface Server {
  id: string;
  country: string;
  countryCode: string;
  city: string;
  speed: number;
  ping: number;
  load: number;
}

interface ServerListProps {
  servers: Server[];
  selectedServerId?: string;
  onServerSelect: (server: Server) => void;
  style?: ViewStyle;
}

export const ServerList: React.FC<ServerListProps> = ({
  servers,
  selectedServerId,
  onServerSelect,
  style,
}) => {
  const { theme } = useTheme();
  const styles = createThemedStyles(theme, createStyles);

  const getLoadColor = (load: number) => {
    if (load < 30) return theme.colors.success;
    if (load < 70) return theme.colors.warning;
    return theme.colors.error;
  };

  const getLoadStatus = (load: number) => {
    if (load < 30) return 'Low';
    if (load < 70) return 'Medium';
    return 'High';
  };

  const renderServerItem = ({ item }: { item: Server }) => (
    <TouchableOpacity
      style={[
        styles.serverItem,
        selectedServerId === item.id && styles.selectedServerItem,
      ]}
      onPress={() => onServerSelect(item)}
    >
      <View style={styles.serverInfo}>
        <View style={styles.flagPlaceholder}>
          <Text style={styles.flagText}>{item.countryCode}</Text>
        </View>
        <View style={styles.serverDetails}>
          <Text style={styles.serverName}>{item.city}, {item.country}</Text>
          <View style={styles.serverMeta}>
            <Text style={styles.speedText}>{item.speed} Mbps</Text>
            <Text style={styles.pingText}>{item.ping}ms ping</Text>
          </View>
        </View>
      </View>

      <View style={styles.serverStats}>
        <View style={styles.loadContainer}>
          <View
            style={[
              styles.loadIndicator,
              { backgroundColor: getLoadColor(item.load) },
            ]}
          />
          <Text style={styles.loadText}>{getLoadStatus(item.load)}</Text>
        </View>
        {selectedServerId === item.id && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Sort servers by speed (highest first)
  const sortedServers = [...servers].sort((a, b) => b.speed - a.speed);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Servers</Text>
        <Text style={styles.subtitle}>Sorted by speed</Text>
      </View>

      <FlatList
        data={sortedServers}
        keyExtractor={(item) => item.id}
        renderItem={renderServerItem}
        showsVerticalScrollIndicator={false}
        style={styles.serverList}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  serverList: {
    maxHeight: 300,
  },
  listContent: {
    paddingBottom: 10,
  },
  serverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surfaceSecondary,
  },
  selectedServerItem: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  serverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagPlaceholder: {
    width: 35,
    height: 25,
    borderRadius: 4,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  flagText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: 'bold',
  },
  serverDetails: {
    flex: 1,
  },
  serverName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  serverMeta: {
    flexDirection: 'row',
    gap: 15,
  },
  speedText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
  },
  pingText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  serverStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  loadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  loadText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
});