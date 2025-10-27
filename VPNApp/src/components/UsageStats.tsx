import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createThemedStyles } from '../utils/theme';

interface UsageStatsProps {
  totalData: string;
  sessionData: string;
  sessionTime: string;
  savedData: string;
  style?: ViewStyle;
}

export const UsageStats: React.FC<UsageStatsProps> = ({
  totalData,
  sessionData,
  sessionTime,
  savedData,
  style,
}) => {
  const { theme } = useTheme();
  const styles = createThemedStyles(theme, createStyles);

  const stats = [
    {
      id: 'total',
      label: 'Всего передано',
      value: totalData,
      icon: '📊',
    },
    {
      id: 'session',
      label: 'За сессию',
      value: sessionData,
      icon: '⚡',
    },
    {
      id: 'time',
      label: 'Время работы',
      value: sessionTime,
      icon: '⏱️',
    },
    {
      id: 'saved',
      label: 'Сэкономлено',
      value: savedData,
      icon: '💰',
    },
  ];

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Статистика использования</Text>

      <View style={styles.statsGrid}>
        {stats.map((stat) => (
          <View key={stat.id} style={styles.statItem}>
            <View style={styles.statIcon}>
              <Text style={styles.iconText}>{stat.icon}</Text>
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          </View>
        ))}
      </View>
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
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});