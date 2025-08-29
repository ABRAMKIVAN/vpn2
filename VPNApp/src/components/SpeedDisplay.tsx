import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createThemedStyles } from '../utils/theme';
import { ThemeColors } from '../types/theme';

interface SpeedDisplayProps {
  downloadSpeed: number;
  uploadSpeed: number;
  ipAddress: string;
  style?: ViewStyle;
}

export const SpeedDisplay: React.FC<SpeedDisplayProps> = ({
  downloadSpeed,
  uploadSpeed,
  ipAddress,
  style,
}) => {
  const { theme } = useTheme();
  const styles = createThemedStyles(theme, createStyles);

  const formatSpeed = (speed: number) => {
    if (speed >= 1000) {
      return `${(speed / 1000).toFixed(1)} Gbps`;
    }
    return `${speed.toFixed(0)} Mbps`;
  };

  const formatIPAddress = (ip: string) => {
    return ip === 'Detecting...' ? ip : `IP: ${ip}`;
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Connection Speed</Text>

      <View style={styles.speedContainer}>
        <View style={styles.speedItem}>
          <Text style={styles.speedLabel}>Download</Text>
          <Text style={[styles.speedValue, { color: theme.colors.success }]}>
            {formatSpeed(downloadSpeed)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.speedItem}>
          <Text style={styles.speedLabel}>Upload</Text>
          <Text style={[styles.speedValue, { color: theme.colors.primary }]}>
            {formatSpeed(uploadSpeed)}
          </Text>
        </View>
      </View>

      <View style={styles.ipContainer}>
        <Text style={styles.ipLabel}>Current IP</Text>
        <Text style={styles.ipValue}>{formatIPAddress(ipAddress)}</Text>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.25,
  },
  speedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  speedItem: {
    flex: 1,
    alignItems: 'center',
  },
  speedLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: '400',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  speedValue: {
    fontSize: 28,
    fontWeight: '400',
    color: colors.success,
    letterSpacing: -0.5,
  },
  divider: {
    width: 1,
    height: 48,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  ipContainer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  ipLabel: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 8,
    fontWeight: '400',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ipValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    fontFamily: 'monospace',
    letterSpacing: 0.25,
  },
});