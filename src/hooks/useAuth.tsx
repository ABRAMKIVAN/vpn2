import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { APP_CONFIG } from '../constants';
import { UserProfile, UserSettings } from '../types';

const supabase = createClient(APP_CONFIG.SUPABASE_URL, APP_CONFIG.SUPABASE_ANON_KEY);

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Создаем анонимного пользователя при первом запуске
        await signInAnonymously();
      }
    } catch (error) {
      console.log('Ошибка загрузки пользователя:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signInAnonymously = async () => {
    try {
      setIsLoading(true);
      
      // Создаем анонимного пользователя
      const anonymousUser: UserProfile = {
        id: `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        isAnonymous: true,
        isPremium: false,
        dataUsage: 0,
        devicesConnected: 1,
        createdAt: new Date(),
        settings: {
          darkMode: true,
          autoConnect: false,
          killSwitch: true,
          dnsProtection: true,
          protocol: 'wireguard',
          autoProtocol: true,
          notifications: true,
          speedAlerts: true,
          language: 'ru',
        },
      };

      setUser(anonymousUser);
      await AsyncStorage.setItem('user', JSON.stringify(anonymousUser));
      
      console.log('Анонимный пользователь создан:', anonymousUser.id);
    } catch (error) {
      console.error('Ошибка создания анонимного пользователя:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('user');
      await AsyncStorage.clear(); // Очищаем все данные
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  const updateUserSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    try {
      const updatedUser: UserProfile = {
        ...user,
        settings: {
          ...user.settings,
          ...newSettings,
        },
      };

      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Ошибка обновления настроек:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signInAnonymously,
    signOut,
    updateUserSettings,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}