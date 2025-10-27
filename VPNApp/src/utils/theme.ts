import { Theme } from '../types/theme';

/**
 * Utility function to create themed styles
 * @param theme - The current theme
 * @param styleCreator - Function that creates styles using theme colors
 * @returns Themed styles object
 */
export const createThemedStyles = <T extends Record<string, any>>(
  theme: Theme,
  styleCreator: (colors: Theme['colors']) => T
): T => {
  return styleCreator(theme.colors);
};

/**
 * Get connection status color based on connection state
 * @param theme - The current theme
 * @param status - Connection status ('connected' | 'disconnected' | 'connecting')
 * @returns Color string
 */
export const getConnectionStatusColor = (
  theme: Theme,
  status: 'connected' | 'disconnected' | 'connecting'
): string => {
  switch (status) {
    case 'connected':
      return theme.colors.connected;
    case 'disconnected':
      return theme.colors.disconnected;
    case 'connecting':
      return theme.colors.connecting;
    default:
      return theme.colors.textSecondary;
  }
};

/**
 * Get text color with proper contrast for the current theme
 * @param theme - The current theme
 * @param variant - Text variant ('primary' | 'secondary' | 'tertiary')
 * @returns Color string
 */
export const getTextColor = (
  theme: Theme,
  variant: 'primary' | 'secondary' | 'tertiary' = 'primary'
): string => {
  switch (variant) {
    case 'primary':
      return theme.colors.text;
    case 'secondary':
      return theme.colors.textSecondary;
    case 'tertiary':
      return theme.colors.textTertiary;
    default:
      return theme.colors.text;
  }
};