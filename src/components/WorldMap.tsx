import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import Svg, {
  Path,
  Circle,
  Line,
  G,
  Defs,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { useTheme } from '../hooks/useTheme';
import { useVPN } from '../hooks/useVPN';

const { width } = Dimensions.get('window');
const mapWidth = width - 80;
const mapHeight = mapWidth * 0.6;

// Упрощенная SVG карта мира (контуры основных континентов)
const worldMapPath = `
M 150 80 
L 200 75 
L 250 85 
L 300 90 
L 350 85 
L 400 95 
L 450 90 
L 500 100 
L 520 120 
L 510 140 
L 480 160 
L 450 180 
L 420 190 
L 390 185 
L 360 175 
L 330 170 
L 300 165 
L 270 160 
L 240 155 
L 210 150 
L 180 145 
L 150 140 
Z
`;

interface ServerDot {
  id: string;
  x: number;
  y: number;
  name: string;
  connected: boolean;
  premium: boolean;
}

export default function WorldMap() {
  const { colors, isDark } = useTheme();
  const { servers, connection } = useVPN();
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const lineAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Анимация пульсации для подключенного сервера
    if (connection.status === 'connected') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.5,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Анимация линии соединения
      Animated.timing(lineAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    } else {
      pulseAnimation.setValue(1);
      lineAnimation.setValue(0);
    }
  }, [connection.status]);

  // Конвертируем координаты серверов в координаты карты
  const convertToMapCoordinates = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * mapWidth;
    const y = ((90 - lat) / 180) * mapHeight;
    return { x, y };
  };

  const serverDots: ServerDot[] = servers.map(server => {
    const coords = convertToMapCoordinates(server.latitude, server.longitude);
    return {
      id: server.id,
      x: coords.x,
      y: coords.y,
      name: server.name,
      connected: connection.server?.id === server.id,
      premium: server.premium,
    };
  });

  // Координаты пользователя (примерные)
  const userLocation = convertToMapCoordinates(55.7558, 37.6173); // Москва

  const connectedServer = serverDots.find(dot => dot.connected);

  return (
    <View style={styles.container}>
      <Svg width={mapWidth} height={mapHeight} viewBox={`0 0 ${mapWidth} ${mapHeight}`}>
        <Defs>
          <RadialGradient id="connectedGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
          </RadialGradient>
          
          <RadialGradient id="serverGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={colors.primary[500]} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={colors.primary[500]} stopOpacity="0.2" />
          </RadialGradient>
          
          <RadialGradient id="premiumGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
          </RadialGradient>
        </Defs>

        {/* Контуры континентов */}
        <G opacity={isDark ? 0.3 : 0.2}>
          {/* Северная Америка */}
          <Path
            d="M 50 80 L 120 75 L 150 85 L 180 90 L 150 120 L 120 140 L 90 130 L 60 120 Z"
            fill={colors.text}
          />
          
          {/* Южная Америка */}
          <Path
            d="M 100 160 L 130 155 L 140 180 L 135 220 L 120 240 L 100 235 L 90 210 L 95 180 Z"
            fill={colors.text}
          />
          
          {/* Европа */}
          <Path
            d="M 220 70 L 280 65 L 290 90 L 270 110 L 240 105 L 220 95 Z"
            fill={colors.text}
          />
          
          {/* Африка */}
          <Path
            d="M 240 120 L 290 115 L 305 150 L 300 200 L 280 230 L 250 225 L 235 190 L 240 150 Z"
            fill={colors.text}
          />
          
          {/* Азия */}
          <Path
            d="M 300 60 L 450 55 L 480 80 L 470 120 L 430 135 L 380 130 L 320 125 L 300 100 Z"
            fill={colors.text}
          />
          
          {/* Австралия */}
          <Path
            d="M 400 200 L 450 195 L 460 215 L 440 225 L 410 220 Z"
            fill={colors.text}
          />
        </G>

        {/* Линия соединения от пользователя к подключенному серверу */}
        {connectedServer && (
          <Animated.View style={{ opacity: lineAnimation }}>
            <Line
              x1={userLocation.x}
              y1={userLocation.y}
              x2={connectedServer.x}
              y2={connectedServer.y}
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity={0.8}
            />
          </Animated.View>
        )}

        {/* Точка пользователя */}
        <Circle
          cx={userLocation.x}
          cy={userLocation.y}
          r="6"
          fill="#ef4444"
          opacity={0.9}
        />
        
        {/* Внешнее кольцо для точки пользователя */}
        <Circle
          cx={userLocation.x}
          cy={userLocation.y}
          r="12"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          opacity={0.5}
        />

        {/* Серверы */}
        {serverDots.map((dot, index) => (
          <G key={dot.id}>
            {/* Пульсирующий эффект для подключенного сервера */}
            {dot.connected && (
              <Animated.View style={{ transform: [{ scale: pulseAnimation }] }}>
                <Circle
                  cx={dot.x}
                  cy={dot.y}
                  r="20"
                  fill="url(#connectedGradient)"
                />
              </Animated.View>
            )}
            
            {/* Основная точка сервера */}
            <Circle
              cx={dot.x}
              cy={dot.y}
              r={dot.connected ? "8" : "5"}
              fill={
                dot.connected 
                  ? "#10b981" 
                  : dot.premium 
                    ? "#f59e0b" 
                    : colors.primary[500]
              }
              opacity={0.9}
            />
            
            {/* Внешнее кольцо */}
            <Circle
              cx={dot.x}
              cy={dot.y}
              r={dot.connected ? "14" : "10"}
              fill="none"
              stroke={
                dot.connected 
                  ? "#10b981" 
                  : dot.premium 
                    ? "#f59e0b" 
                    : colors.primary[500]
              }
              strokeWidth="1"
              opacity={0.5}
            />
          </G>
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});