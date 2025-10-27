import React from 'react';
import { render } from '@testing-library/react-native';
import { SpeedDisplay } from '../../components/SpeedDisplay';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ThemeColors, ThemeMode } from '../../types/theme';
import { LIGHT_THEME_COLORS } from '../../constants/theme';

// Mock the useTheme hook
jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      mode: 'light' as ThemeMode,
      colors: LIGHT_THEME_COLORS,
      isDark: false,
    },
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('SpeedDisplay Component', () => {
  const mockProps = {
    downloadSpeed: 450,
    uploadSpeed: 150,
    ipAddress: '192.168.1.100',
  };

  it('should render correctly with provided speeds', () => {
    const { getByText } = render(
      <ThemeProvider>
        <SpeedDisplay {...mockProps} />
      </ThemeProvider>
    );

    expect(getByText('Connection Speed')).toBeTruthy();
    expect(getByText('450 Mbps')).toBeTruthy();
    expect(getByText('150 Mbps')).toBeTruthy();
    expect(getByText('IP: 192.168.1.100')).toBeTruthy();
  });

  it('should format high speeds correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <SpeedDisplay
          downloadSpeed={1500}
          uploadSpeed={500}
          ipAddress="10.0.0.1"
        />
      </ThemeProvider>
    );

    expect(getByText('1.5 Gbps')).toBeTruthy();
    expect(getByText('500 Mbps')).toBeTruthy();
  });

  it('should handle zero speeds', () => {
    const { getByText } = render(
      <ThemeProvider>
        <SpeedDisplay
          downloadSpeed={0}
          uploadSpeed={0}
          ipAddress="Detecting..."
        />
      </ThemeProvider>
    );

    expect(getByText('0 Mbps')).toBeTruthy();
    expect(getByText('Detecting...')).toBeTruthy();
  });

  it('should format IP address correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <SpeedDisplay
          downloadSpeed={100}
          uploadSpeed={50}
          ipAddress="203.0.113.5"
        />
      </ThemeProvider>
    );

    expect(getByText('IP: 203.0.113.5')).toBeTruthy();
  });
});