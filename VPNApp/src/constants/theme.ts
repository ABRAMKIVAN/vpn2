import { ThemeColors } from '../types/theme';

// Google Material Design Theme
export const LIGHT_THEME_COLORS: ThemeColors = {
  // Background colors
  background: '#f8f9fa',
  surface: '#ffffff',
  surfaceSecondary: '#f1f3f4',

  // Text colors
  text: '#202124',
  textSecondary: '#5f6368',
  textTertiary: '#9aa0a6',

  // Primary colors - Google Blue
  primary: '#1a73e8',
  primaryLight: '#4285f4',
  primaryDark: '#1557b0',

  // Status colors - Google brand colors
  success: '#34a853',
  error: '#ea4335',
  warning: '#fbbc04',
  info: '#4285f4',

  // Border colors
  border: '#e8eaed',
  borderLight: '#f1f3f4',

  // VPN specific colors
  connected: '#34a853',
  disconnected: '#ea4335',
  connecting: '#fbbc04',
};

// Nothing Dark Theme
export const DARK_THEME_COLORS: ThemeColors = {
  // Background colors
  background: '#000000',
  surface: '#1a1a1a',
  surfaceSecondary: '#2a2a2a',

  // Text colors
  text: '#ffffff',
  textSecondary: '#9aa0a6',
  textTertiary: '#808080',

  // Primary colors - Nothing Orange
  primary: '#ff6b35',
  primaryLight: '#ff8c42',
  primaryDark: '#e55a2b',

  // Status colors
  success: '#34a853',
  error: '#ea4335',
  warning: '#fbbc04',
  info: '#4285f4',

  // Border colors
  border: '#404040',
  borderLight: '#2a2a2a',

  // VPN specific colors
  connected: '#34a853',
  disconnected: '#ea4335',
  connecting: '#fbbc04',
};

export const THEME_STORAGE_KEY = 'vpn_app_theme_mode';