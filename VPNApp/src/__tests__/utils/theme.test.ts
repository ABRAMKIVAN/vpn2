import { ThemeColors, ThemeMode } from '../../types/theme';
import { createThemedStyles, getConnectionStatusColor } from '../../utils/theme';
import { LIGHT_THEME_COLORS, DARK_THEME_COLORS } from '../../constants/theme';

describe('Theme Utils', () => {
  const mockLightTheme = {
    mode: 'light' as ThemeMode,
    colors: LIGHT_THEME_COLORS,
    isDark: false,
  };

  const mockDarkTheme = {
    mode: 'dark' as ThemeMode,
    colors: DARK_THEME_COLORS,
    isDark: true,
  };

  describe('createThemedStyles', () => {
    it('should create styles using theme colors', () => {
      const styleCreator = (colors: ThemeColors) => ({
        container: {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
        text: {
          color: colors.text,
        },
      });

      const styles = createThemedStyles(mockLightTheme, styleCreator);

      expect(styles.container.backgroundColor).toBe(LIGHT_THEME_COLORS.background);
      expect(styles.container.borderColor).toBe(LIGHT_THEME_COLORS.border);
      expect(styles.text.color).toBe(LIGHT_THEME_COLORS.text);
    });

    it('should work with dark theme', () => {
      const styleCreator = (colors: ThemeColors) => ({
        container: {
          backgroundColor: colors.background,
        },
      });

      const styles = createThemedStyles(mockDarkTheme, styleCreator);

      expect(styles.container.backgroundColor).toBe(DARK_THEME_COLORS.background);
    });
  });

  describe('getConnectionStatusColor', () => {
    it('should return correct color for connected status', () => {
      const color = getConnectionStatusColor(mockLightTheme, 'connected');
      expect(color).toBe(LIGHT_THEME_COLORS.connected);
    });

    it('should return correct color for disconnected status', () => {
      const color = getConnectionStatusColor(mockLightTheme, 'disconnected');
      expect(color).toBe(LIGHT_THEME_COLORS.disconnected);
    });

    it('should return correct color for connecting status', () => {
      const color = getConnectionStatusColor(mockLightTheme, 'connecting');
      expect(color).toBe(LIGHT_THEME_COLORS.connecting);
    });

    it('should work with dark theme', () => {
      const color = getConnectionStatusColor(mockDarkTheme, 'connected');
      expect(color).toBe(DARK_THEME_COLORS.connected);
    });
  });
});