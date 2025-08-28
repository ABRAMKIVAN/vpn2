import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../hooks/useTheme';
import { useVPN } from '../hooks/useVPN';

export default function ConnectionButton() {
  const { colors, isDark } = useTheme();
  const { connection, connect, disconnect, servers, isLoading } = useVPN();
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (connection.status === 'connected') {
      // Анимация пульсации для подключенного состояния
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnimation.setValue(1);
    }

    if (connection.status === 'connecting') {
      // Анимация вращения для состояния подключения
      Animated.loop(
        Animated.timing(rotateAnimation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnimation.setValue(0);
    }
  }, [connection.status]);

  const handlePress = async () => {
    if (connection.status === 'connected') {
      await disconnect();
    } else if (connection.status === 'disconnected') {
      // Подключаемся к первому доступному серверу
      const defaultServer = servers.find(s => !s.premium) || servers[0];
      if (defaultServer) {
        await connect(defaultServer);
      }
    }
  };

  const getButtonState = () => {
    switch (connection.status) {
      case 'connected':
        return {
          color: '#10b981',
          icon: 'shield-check',
          text: 'Подключено',
          gradient: ['#10b981', '#059669'],
        };
      case 'connecting':
        return {
          color: '#f59e0b',
          icon: 'loading',
          text: 'Подключение...',
          gradient: ['#f59e0b', '#d97706'],
        };
      case 'error':
        return {
          color: '#ef4444',
          icon: 'shield-alert',
          text: 'Ошибка',
          gradient: ['#ef4444', '#dc2626'],
        };
      default:
        return {
          color: '#737373',
          icon: 'shield-off',
          text: 'Не подключено',
          gradient: [colors.surface, colors.surface],
        };
    }
  };

  const buttonState = getButtonState();
  const isConnected = connection.status === 'connected';
  const isConnecting = connection.status === 'connecting';

  const rotateInterpolate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={isLoading || isConnecting}
        style={styles.buttonContainer}
      >
        <Animated.View
          style={[
            styles.outerRing,
            {
              transform: [{ scale: pulseAnimation }],
              borderColor: buttonState.color,
            },
          ]}
        >
          <View
            style={[
              styles.innerContainer,
              {
                backgroundColor: colors.surface,
                shadowColor: isDark ? '#000000' : '#d1d1d1',
              },
            ]}
          >
            <LinearGradient
              colors={buttonState.gradient}
              style={styles.gradientButton}
            >
              <Animated.View
                style={[
                  styles.iconContainer,
                  isConnecting && {
                    transform: [{ rotate: rotateInterpolate }],
                  },
                ]}
              >
                <Icon
                  name={buttonState.icon}
                  size={40}
                  color="#ffffff"
                />
              </Animated.View>
            </LinearGradient>
          </View>
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.statusContainer}>
        <Text
          style={[
            styles.statusText,
            {
              color: buttonState.color,
              fontWeight: isConnected ? '600' : '500',
            },
          ]}
        >
          {buttonState.text}
        </Text>
        
        {connection.server && (
          <Text
            style={[
              styles.serverText,
              { color: colors.textSecondary },
            ]}
          >
            {connection.server.name}
          </Text>
        )}
        
        {isConnected && connection.connectedAt && (
          <Text
            style={[
              styles.durationText,
              { color: colors.textSecondary },
            ]}
          >
            Подключено {getConnectionDuration()}
          </Text>
        )}
      </View>
    </View>
  );

  function getConnectionDuration(): string {
    if (!connection.connectedAt) return '';
    
    const duration = Date.now() - connection.connectedAt.getTime();
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}ч ${minutes % 60}м`;
    } else if (minutes > 0) {
      return `${minutes}м ${seconds % 60}с`;
    } else {
      return `${seconds}с`;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.3,
  },
  innerContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  serverText: {
    fontSize: 14,
    marginBottom: 2,
  },
  durationText: {
    fontSize: 12,
  },
});