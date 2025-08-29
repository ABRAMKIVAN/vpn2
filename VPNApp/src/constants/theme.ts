import { ThemeColors } from '../types/theme';

export const LIGHT_THEME_COLORS: ThemeColors = {
  // Background colors
  background: '#ffffff',
  surface: '#f8f9fa',
  surfaceSecondary: '#e9ecef',

  // Text colors
  text: '#212529',
  textSecondary: '#6c757d',
  textTertiary: '#adb5bd',

  // Primary colors
  primary: '#007bff',
  primaryLight: '#4dabf7',
  primaryDark: '#0056b3',

  // Status colors
  success: '#28a745',
  error: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',

  // Border colors
  border: '#dee2e6',
  borderLight: '#f8f9fa',

  // VPN specific colors
  connected: '#28a745',
  disconnected: '#dc3545',
  connecting: '#ffc107',
};

export const DARK_THEME_COLORS: ThemeColors = {
  // Background colors
  background: '#121212',
  surface: '#1e1e1e',
  surfaceSecondary: '#2a2a2a',

  // Text colors
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  textTertiary: '#808080',

  // Primary colors
  primary: '#4dabf7',
  primaryLight: '#74b9ff',
  primaryDark: '#0056b3',

  // Status colors
  success: '#40c057',
  error: '#fa5252',
  warning: '#ffd43b',
  info: '#339af0',

  // Border colors
  border: '#404040',
  borderLight: '#2a2a2a',

  // VPN specific colors
  connected: '#40c057',
  disconnected: '#fa5252',
  connecting: '#ffd43b',
};

export const THEME_STORAGE_KEY = 'vpn_app_theme_mode';