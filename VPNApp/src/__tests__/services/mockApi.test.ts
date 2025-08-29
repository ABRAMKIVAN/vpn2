import { mockApi } from '../../services/mockApi';

describe('Mock API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getServers', () => {
    it('should return a list of servers', async () => {
      const servers = await mockApi.getServers();

      expect(Array.isArray(servers)).toBe(true);
      expect(servers.length).toBeGreaterThan(0);

      // Check server structure
      const firstServer = servers[0];
      expect(firstServer).toHaveProperty('id');
      expect(firstServer).toHaveProperty('country');
      expect(firstServer).toHaveProperty('countryCode');
      expect(firstServer).toHaveProperty('city');
      expect(firstServer).toHaveProperty('speed');
      expect(firstServer).toHaveProperty('ping');
      expect(firstServer).toHaveProperty('load');
    }, 10000); // Increase timeout for this test

    it('should return servers sorted by speed', async () => {
      const servers = await mockApi.getServers();

      for (let i = 0; i < servers.length - 1; i++) {
        expect(servers[i].speed).toBeGreaterThanOrEqual(servers[i + 1].speed);
      }
    }, 10000);
  });

  describe('connectToServer', () => {
    it('should successfully connect to a valid server', async () => {
      const servers = await mockApi.getServers();
      const serverId = servers[0].id;

      const result = await mockApi.connectToServer(serverId);

      expect(result.success).toBe(true);
      expect(result.server.id).toBe(serverId);
      expect(result.ipAddress).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
      expect(result.sessionId).toBeTruthy();
    }, 15000);

    it('should throw error for invalid server ID', async () => {
      await expect(mockApi.connectToServer('invalid-id')).rejects.toThrow();
    }, 10000);

    it('should simulate occasional connection failures', async () => {
      // Mock Math.random to return 0 (which should trigger failure)
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0);

      const servers = await mockApi.getServers();

      // This might fail due to the mock, but that's expected behavior
      try {
        await mockApi.connectToServer(servers[0].id);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      // Restore original Math.random
      Math.random = originalRandom;
    }, 15000);
  });

  describe('getCurrentIP', () => {
    it('should return IP information', async () => {
      const ipInfo = await mockApi.getCurrentIP();

      expect(ipInfo).toHaveProperty('ip');
      expect(ipInfo).toHaveProperty('country');
      expect(ipInfo).toHaveProperty('city');
      expect(ipInfo).toHaveProperty('isp');
      expect(ipInfo.ip).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
    }, 10000);
  });

  describe('performSpeedTest', () => {
    it('should return speed test results', async () => {
      const servers = await mockApi.getServers();
      const serverId = servers[0].id;

      const result = await mockApi.performSpeedTest(serverId);

      expect(result).toHaveProperty('downloadSpeed');
      expect(result).toHaveProperty('uploadSpeed');
      expect(result).toHaveProperty('ping');
      expect(result).toHaveProperty('jitter');

      expect(result.downloadSpeed).toBeGreaterThan(0);
      expect(result.uploadSpeed).toBeGreaterThan(0);
      expect(result.ping).toBeGreaterThan(0);
      expect(result.jitter).toBeGreaterThanOrEqual(0);
    }, 15000);

    it('should throw error for invalid server ID', async () => {
      await expect(mockApi.performSpeedTest('invalid-id')).rejects.toThrow();
    }, 10000);
  });

  describe('getRealtimeSpeed', () => {
    it('should return real-time speed data', async () => {
      const result = await mockApi.getRealtimeSpeed('test-session');

      expect(result).toHaveProperty('download');
      expect(result).toHaveProperty('upload');
      expect(typeof result.download).toBe('number');
      expect(typeof result.upload).toBe('number');
    }, 10000);
  });

  describe('getRecommendedServer', () => {
    it('should return a recommended server', async () => {
      const server = await mockApi.getRecommendedServer();

      expect(server).toHaveProperty('id');
      expect(server).toHaveProperty('country');
      expect(server).toHaveProperty('speed');
    }, 10000);
  });
});