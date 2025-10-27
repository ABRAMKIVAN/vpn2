import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createThemedStyles } from '../utils/theme';
import { ThemeColors } from '../types/theme';

interface NotificationCenterProps {
  notifications: string[];
  style?: ViewStyle;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  style,
}) => {
  const { theme } = useTheme();
  const styles = createThemedStyles(theme, createStyles);

  if (notifications.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No recent notifications</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Notifications</Text>

      <ScrollView
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {notifications.map((notification, index) => (
          <View key={index} style={styles.notificationItem}>
            <Text style={styles.notificationText}>{notification}</Text>
          </View>
        ))}
      </ScrollView>

      {notifications.length > 5 && (
        <TouchableOpacity style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      )}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  notificationsList: {
    maxHeight: 200,
  },
  listContent: {
    paddingBottom: 10,
  },
  notificationItem: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  notificationText: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 16,
  },
  clearButton: {
    alignSelf: 'center',
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clearButtonText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});