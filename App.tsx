import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Импорт экранов
import HomeScreen from './src/screens/HomeScreen';
import ServersScreen from './src/screens/ServersScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Импорт провайдеров
import { ThemeProvider } from './src/hooks/useTheme';
import { VPNProvider } from './src/hooks/useVPN';
import { AuthProvider } from './src/hooks/useAuth';

// Removed Tailwind CSS import

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#333',
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#737373',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'shield-check' : 'shield-check-outline';
              break;
            case 'Servers':
              iconName = focused ? 'server' : 'server-outline';
              break;
            case 'Settings':
              iconName = focused ? 'cog' : 'cog-outline';
              break;
            case 'Profile':
              iconName = focused ? 'account-circle' : 'account-circle-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          tabBarLabel: 'Главная',
          tabBarBadge: undefined 
        }} 
      />
      <Tab.Screen 
        name="Servers" 
        component={ServersScreen} 
        options={{ 
          tabBarLabel: 'Серверы' 
        }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ 
          tabBarLabel: 'Настройки' 
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          tabBarLabel: 'Профиль' 
        }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider>
            <VPNProvider>
              <NavigationContainer>
                <View style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
                  <StatusBar style="light" backgroundColor="#1a1a1a" />
                  <Stack.Navigator
                    screenOptions={{
                      headerShown: false,
                      gestureEnabled: true,
                      cardStyleInterpolator: ({ current, layouts }) => {
                        return {
                          cardStyle: {
                            transform: [
                              {
                                translateX: current.progress.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [layouts.screen.width, 0],
                                }),
                              },
                            ],
                          },
                        };
                      },
                    }}
                  >
                    <Stack.Screen name="Main" component={TabNavigator} />
                  </Stack.Navigator>
                </View>
              </NavigationContainer>
            </VPNProvider>
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}