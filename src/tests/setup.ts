import 'react-native-gesture-handler/jestSetup';

// Моки для React Native модулей
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-svg', () => ({
  Svg: 'Svg',
  Circle: 'Circle',
  Path: 'Path',
  Line: 'Line',
  G: 'G',
  Defs: 'Defs',
  RadialGradient: 'RadialGradient',
  Stop: 'Stop',
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  getCurrentState: jest.fn(() => Promise.resolve({
    isConnected: true,
    type: 'wifi',
  })),
}));

jest.mock('react-native-device-info', () => ({
  getVersion: () => '1.0.0',
  getBuildNumber: () => '1',
  getSystemName: () => 'iOS',
}));

// Глобальные моки
global.__DEV__ = true;

// Подавление предупреждений в тестах
console.warn = jest.fn();
console.error = jest.fn();