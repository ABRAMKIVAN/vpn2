import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { createThemedStyles, getConnectionStatusColor } from '../utils/theme';
import { ThemeColors } from '../types/theme';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

interface ConnectionButtonProps {
  status: ConnectionStatus;
  onPress: () => void;
  style?: ViewStyle;
}

export const ConnectionButton: React.FC<ConnectionButtonProps> = ({
  status,
  onPress,
  style,
}) => {
  const { theme } = useTheme();
  const styles = createThemedStyles(theme, createStyles);

  // Animation values
  const pulseScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  const rotation = useSharedValue(0);

  // Pulse animation for connecting state
  useEffect(() => {
    if (status === 'connecting') {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 300 });
    }
  }, [status, pulseScale]);

  // Rotation animation for connecting state
  useEffect(() => {
    if (status === 'connecting') {
      rotation.value = withRepeat(
        withTiming(360, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      rotation.value = 0;
    }
  }, [status, rotation]);

  // Button press animation
  const handlePressIn = () => {
    buttonScale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100 });
  };

  // Animated styles
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const getButtonText = () => {
    switch (status) {
      case 'connected':
        return 'Disconnect';
      case 'connecting':
        return 'Connecting...';
      default:
        return 'Connect';
    }
  };

  const getButtonColor = () => {
    return getConnectionStatusColor(theme, status);
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.pulseContainer, pulseStyle]}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
          style={styles.touchable}
        >
          <Animated.View
            style={[
              styles.button,
              buttonStyle,
              { backgroundColor: getButtonColor() },
            ]}
          >
            {status === 'connecting' ? (
              <Animated.View style={[styles.spinner, rotationStyle]}>
                <View style={styles.spinnerArc} />
              </Animated.View>
            ) : (
              <Text style={styles.buttonText}>{getButtonText()}</Text>
            )}
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable: {
    borderRadius: 75,
    overflow: 'hidden',
  },
  button: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  spinner: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerArc: {
    width: 4,
    height: 20,
    backgroundColor: colors.text,
    borderRadius: 2,
    position: 'absolute',
    top: 0,
  },
});