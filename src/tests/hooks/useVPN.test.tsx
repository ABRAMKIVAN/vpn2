import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { VPNProvider, useVPN } from '../../hooks/useVPN';
import { VPNServer } from '../../types';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <VPNProvider>{children}</VPNProvider>
);

const mockServer: VPNServer = {
  id: 'test-server',
  name: 'Тест сервер',
  country: 'Тест страна',
  countryCode: 'TS',
  city: 'Тест город',
  latitude: 0,
  longitude: 0,
  load: 50,
  ping: 25,
  premium: false,
  protocols: ['wireguard'],
  endpoint: 'test.example.com',
};

describe('useVPN', () => {
  it('инициализируется с правильным состоянием', () => {
    const { result } = renderHook(() => useVPN(), { wrapper });

    expect(result.current.connection.status).toBe('disconnected');
    expect(result.current.servers).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('подключается к серверу', async () => {
    const { result } = renderHook(() => useVPN(), { wrapper });

    await act(async () => {
      await result.current.connect(mockServer);
    });

    expect(result.current.connection.status).toBe('connected');
    expect(result.current.connection.server).toEqual(mockServer);
  });

  it('отключается от сервера', async () => {
    const { result } = renderHook(() => useVPN(), { wrapper });

    // Сначала подключаемся
    await act(async () => {
      await result.current.connect(mockServer);
    });

    expect(result.current.connection.status).toBe('connected');

    // Затем отключаемся
    await act(async () => {
      await result.current.disconnect();
    });

    expect(result.current.connection.status).toBe('disconnected');
    expect(result.current.connection.server).toBeUndefined();
  });

  it('переключается между серверами', async () => {
    const { result } = renderHook(() => useVPN(), { wrapper });

    const newServer: VPNServer = {
      ...mockServer,
      id: 'new-server',
      name: 'Новый сервер',
    };

    // Подключаемся к первому серверу
    await act(async () => {
      await result.current.connect(mockServer);
    });

    expect(result.current.connection.server?.id).toBe('test-server');

    // Переключаемся на новый сервер
    await act(async () => {
      await result.current.switchServer(newServer);
    });

    expect(result.current.connection.server?.id).toBe('new-server');
  });

  it('тестирует пинг сервера', async () => {
    const { result } = renderHook(() => useVPN(), { wrapper });

    const ping = await act(async () => {
      return await result.current.testServerPing(mockServer);
    });

    expect(typeof ping).toBe('number');
    expect(ping).toBeGreaterThan(0);
  });
});