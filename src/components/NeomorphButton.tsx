import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Animated,
  GestureResponderEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../hooks/useTheme';

interface NeomorphButtonProps {
  title?: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: 'primary' | 'secondary' | 'success' | 'error';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  style?: any;
  children?: React.ReactNode;
}

export default function NeomorphButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  children,
}: NeomorphButtonProps) {
  const { colors, isDark } = useTheme();
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getVariantColors = () => {
    switch (variant) {
      case 'primary':
        return {
          gradient: ['#0ea5e9', '#0284c7'],
          text: '#ffffff',
        };
      case 'secondary':
        return {
          gradient: [colors.surface, colors.surface],
          text: colors.text,
        };
      case 'success':
        return {
          gradient: ['#10b981', '#059669'],
          text: '#ffffff',
        };
      case 'error':
        return {
          gradient: ['#ef4444', '#dc2626'],
          text: '#ffffff',
        };
      default:
        return {
          gradient: ['#0ea5e9', '#0284c7'],
          text: '#ffffff',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          height: 40,
          paddingHorizontal: 16,
          borderRadius: 12,
        };
      case 'medium':
        return {
          height: 50,
          paddingHorizontal: 24,
          borderRadius: 16,
        };
      case 'large':
        return {
          height: 60,
          paddingHorizontal: 32,
          borderRadius: 20,
        };
      default:
        return {
          height: 50,
          paddingHorizontal: 24,
          borderRadius: 16,
        };
    }
  };

  const variantColors = getVariantColors();
  const sizeStyles = getSizeStyles();

  const shadowStyle = isDark
    ? {
        shadowColor: '#000000',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      }
    : {
        shadowColor: '#d1d1d1',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleValue }],
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.button,
          sizeStyles,
          shadowStyle,
          {
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        <LinearGradient
          colors={variantColors.gradient}
          style={[
            styles.gradient,
            {
              borderRadius: sizeStyles.borderRadius,
            },
          ]}
        >
          <View style={styles.content}>
            {icon && iconPosition === 'left' && (
              <Icon
                name={icon}
                size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
                color={variantColors.text}
                style={[styles.icon, title ? { marginRight: 8 } : null]}
              />
            )}
            
            {children || (title && (
              <Text
                style={[
                  styles.text,
                  {
                    color: variantColors.text,
                    fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
                    fontWeight: variant === 'primary' ? '600' : '500',
                  },
                ]}
              >
                {loading ? 'Загрузка...' : title}
              </Text>
            ))}
            
            {icon && iconPosition === 'right' && (
              <Icon
                name={icon}
                size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
                color={variantColors.text}
                style={[styles.icon, title ? { marginLeft: 8 } : null]}
              />
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'System',
    fontWeight: '600',
  },
  icon: {
    // Иконка стилизуется в родительском компоненте
  },
});