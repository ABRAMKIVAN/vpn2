import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface NeomorphCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  inset?: boolean;
  padding?: number;
  borderRadius?: number;
}

export default function NeomorphCard({
  children,
  style,
  inset = false,
  padding = 20,
  borderRadius = 16,
}: NeomorphCardProps) {
  const { colors, isDark } = useTheme();

  const getShadowStyles = () => {
    if (isDark) {
      return inset
        ? {
            // Внутренняя тень для темной темы
            shadowColor: '#000000',
            shadowOffset: { width: -6, height: -6 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: -8,
          }
        : {
            // Внешняя тень для темной темы
            shadowColor: '#000000',
            shadowOffset: { width: 6, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          };
    } else {
      return inset
        ? {
            // Внутренняя тень для светлой темы
            shadowColor: '#d1d1d1',
            shadowOffset: { width: -6, height: -6 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: -8,
          }
        : {
            // Внешняя тень для светлой темы
            shadowColor: '#d1d1d1',
            shadowOffset: { width: 6, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          };
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          padding,
          borderRadius,
        },
        getShadowStyles(),
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    // Базовые стили карты
  },
});