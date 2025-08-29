import { Server } from '../types/server';

export interface ConnectionResponse {
  success: boolean;
  server: Server;
  ipAddress: string;
  sessionId: string;
}

export interface SpeedTestResponse {
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  jitter: number;
}

export interface IPInfoResponse {
  ip: string;
  country: string;
  city: string;
  isp: string;
}

class MockApiService {
  private baseDelay = 1000; // Base delay for API calls

  // Mock servers database
  private mockServers: Server[] = [
    {
      id: '1',
      country: 'United States',
      countryCode: 'US',
      city: 'New York',
      speed: 500,
      ping: 45,
      load: 30,
      latitude: 40.7128,
      longitude: -74.0060,
    },
    {
      id: '2',
      country: 'Netherlands',
      countryCode: 'NL',
      city: 'Amsterdam',
      speed: 480,
      ping: 38,
      load: 25,
      latitude: 52.3676,
      longitude: 4.9041,
    },
    {
      id: '3',
      country: 'Germany',
      countryCode: 'DE',
      city: 'Frankfurt',
      speed: 460,
      ping: 42,
      load: 35,
      latitude: 50.1109,
      longitude: 8.6821,
    },
    {
      id: '4',
      country: 'United Kingdom',
      countryCode: 'GB',
      city: 'London',
      speed: 450,
      ping: 48,
      load: 40,
      latitude: 51.5074,
      longitude: -0.1278,
    },
    {
      id: '5',
      country: 'Japan',
      countryCode: 'JP',
      city: 'Tokyo',
      speed: 430,
      ping: 120,
      load: 45,
      latitude: 35.6762,
      longitude: 139.6503,
    },
    {
      id: '6',
      country: 'Singapore',
      countryCode: 'SG',
      city: 'Singapore',
      speed: 470,
      ping: 85,
      load: 28,
      latitude: 1.3521,
      longitude: 103.8198,
    },
    {
      id: '7',
      country: 'Canada',
      countryCode: 'CA',
      city: 'Toronto',
      speed: 440,
      ping: 55,
      load: 32,
      latitude: 43.6532,
      longitude: -79.3832,
    },
    {
      id: '8',
      country: 'Australia',
      countryCode: 'AU',
      city: 'Sydney',
      speed: 420,
      ping: 180,
      load: 50,
      latitude: -33.8688,
      longitude: 151.2093,
    },
  ];

  // Simulate API delay
  private delay(min: number = 500, max: number = 2000): Promise<void> {
    const delayTime = Math.random() * (max - min) + min;
    return new Promise<void>((resolve) => setTimeout(() => resolve(), delayTime));
  }

  // Get all available servers
  async getServers(): Promise<Server[]> {
    await this.delay(300, 800);
    return [...this.mockServers];
  }

  // Connect to a VPN server
  async connectToServer(serverId: string): Promise<ConnectionResponse> {
    await this.delay(1500, 3000); // Simulate connection time

    const server = this.mockServers.find(s => s.id === serverId);
    if (!server) {
      throw new Error('Server not found');
    }

    // Simulate occasional connection failures (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('Connection failed. Please try again.');
    }

    const response: ConnectionResponse = {
      success: true,
      server,
      ipAddress: this.generateRandomIP(),
      sessionId: this.generateSessionId(),
    };

    return response;
  }

  // Disconnect from VPN
  async disconnect(): Promise<{ success: boolean }> {
    await this.delay(500, 1500);
    return { success: true };
  }

  // Get current IP information
  async getCurrentIP(): Promise<IPInfoResponse> {
    await this.delay(300, 1000);

    const ips = [
      { ip: '192.168.1.100', country: 'United States', city: 'New York', isp: 'Verizon' },
      { ip: '10.0.0.50', country: 'Netherlands', city: 'Amsterdam', isp: 'KPN' },
      { ip: '172.16.0.25', country: 'Germany', city: 'Frankfurt', isp: 'Deutsche Telekom' },
      { ip: '203.0.113.5', country: 'Japan', city: 'Tokyo', isp: 'NTT' },
    ];

    return ips[Math.floor(Math.random() * ips.length)];
  }

  // Perform speed test
  async performSpeedTest(serverId: string): Promise<SpeedTestResponse> {
    await this.delay(2000, 5000); // Speed test takes time

    const server = this.mockServers.find(s => s.id === serverId);
    if (!server) {
      throw new Error('Server not found');
    }

    // Base speeds on server specifications with some variance
    const baseDownload = server.speed;
    const baseUpload = Math.floor(baseDownload * 0.3); // Upload is typically 30% of download

    const variance = 0.15; // 15% variance
    const downloadVariance = (Math.random() - 0.5) * 2 * variance;
    const uploadVariance = (Math.random() - 0.5) * 2 * variance;

    const response: SpeedTestResponse = {
      downloadSpeed: Math.max(50, Math.floor(baseDownload * (1 + downloadVariance))),
      uploadSpeed: Math.max(20, Math.floor(baseUpload * (1 + uploadVariance))),
      ping: Math.floor(server.ping + (Math.random() - 0.5) * 20), // ±10ms variance
      jitter: Math.floor(Math.random() * 10) + 1, // 1-10ms jitter
    };

    return response;
  }

  // Get server load information
  async getServerLoad(serverId: string): Promise<{ load: number; users: number }> {
    await this.delay(200, 500);

    const server = this.mockServers.find(s => s.id === serverId);
    if (!server) {
      throw new Error('Server not found');
    }

    // Simulate dynamic load changes
    const baseLoad = server.load;
    const loadVariance = (Math.random() - 0.5) * 20; // ±10% variance
    const currentLoad = Math.max(0, Math.min(100, baseLoad + loadVariance));

    return {
      load: Math.floor(currentLoad),
      users: Math.floor((currentLoad / 100) * 1000), // Estimate users based on load
    };
  }

  // Get recommended server based on location and performance
  async getRecommendedServer(userLocation?: { latitude: number; longitude: number }): Promise<Server> {
    await this.delay(500, 1000);

    // For now, return the fastest server with lowest load
    const recommended = this.mockServers
      .sort((a, b) => {
        // Sort by speed (desc) then by load (asc)
        if (a.speed !== b.speed) return b.speed - a.speed;
        return a.load - b.load;
      })[0];

    return recommended;
  }

  // Simulate real-time speed monitoring
  async getRealtimeSpeed(sessionId: string): Promise<{ download: number; upload: number }> {
    // This would be called frequently during connection
    const delay = Math.random() * 200 + 100; // 100-300ms delay
    await new Promise<void>((resolve) => setTimeout(() => resolve(), delay));

    // Simulate speed fluctuations
    const baseDownload = 450;
    const baseUpload = 150;
    const fluctuation = 0.1; // 10% fluctuation

    return {
      download: Math.floor(baseDownload * (1 + (Math.random() - 0.5) * fluctuation * 2)),
      upload: Math.floor(baseUpload * (1 + (Math.random() - 0.5) * fluctuation * 2)),
    };
  }

  // Generate random IP address
  private generateRandomIP(): string {
    const octets = [];
    for (let i = 0; i < 4; i++) {
      octets.push(Math.floor(Math.random() * 256));
    }
    return octets.join('.');
  }

  // Generate session ID
  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  // Simulate API error for testing
  async simulateError(): Promise<never> {
    await this.delay(500, 1000);
    throw new Error('Simulated API error for testing purposes');
  }
}

export const mockApi = new MockApiService();