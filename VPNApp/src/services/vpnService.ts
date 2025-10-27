import { mockApi } from './mockApi';
import { Server } from '../types/server';

export interface VPNConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  currentServer: Server | null;
  downloadSpeed: number;
  uploadSpeed: number;
  ipAddress: string;
  sessionId: string | null;
  lastConnectedAt: Date | null;
}

export interface VPNSettings {
  selectedProtocol: 'wireguard' | 'shadowsocks' | 'vless';
  killSwitchEnabled: boolean;
  dnsProtectionEnabled: boolean;
  autoProtocolEnabled: boolean;
}

class VPNService {
  private connectionState: VPNConnectionState = {
    isConnected: false,
    isConnecting: false,
    currentServer: null,
    downloadSpeed: 0,
    uploadSpeed: 0,
    ipAddress: 'Detecting...',
    sessionId: null,
    lastConnectedAt: null,
  };

  private settings: VPNSettings = {
    selectedProtocol: 'wireguard',
    killSwitchEnabled: false,
    dnsProtectionEnabled: true,
    autoProtocolEnabled: false,
  };

  private speedUpdateInterval: ReturnType<typeof setInterval> | null = null;
  private onStateChangeCallbacks: ((state: VPNConnectionState) => void)[] = [];

  // Subscribe to connection state changes
  onStateChange(callback: (state: VPNConnectionState) => void) {
    this.onStateChangeCallbacks.push(callback);
    return () => {
      this.onStateChangeCallbacks = this.onStateChangeCallbacks.filter(cb => cb !== callback);
    };
  }

  // Notify all subscribers of state changes
  private notifyStateChange() {
    this.onStateChangeCallbacks.forEach(callback => callback(this.connectionState));
  }

  // Get current connection state
  getConnectionState(): VPNConnectionState {
    return { ...this.connectionState };
  }

  // Get current settings
  getSettings(): VPNSettings {
    return { ...this.settings };
  }

  // Update settings
  updateSettings(newSettings: Partial<VPNSettings>) {
    this.settings = { ...this.settings, ...newSettings };
  }

  // Connect to VPN
  async connect(serverId: string): Promise<void> {
    if (this.connectionState.isConnecting) {
      throw new Error('Already connecting');
    }

    try {
      this.connectionState.isConnecting = true;
      this.notifyStateChange();

      // Attempt connection
      const response = await mockApi.connectToServer(serverId);

      // Update connection state
      this.connectionState = {
        isConnected: true,
        isConnecting: false,
        currentServer: response.server,
        downloadSpeed: 0,
        uploadSpeed: 0,
        ipAddress: response.ipAddress,
        sessionId: response.sessionId,
        lastConnectedAt: new Date(),
      };

      // Start real-time speed monitoring
      this.startSpeedMonitoring();

      this.notifyStateChange();
    } catch (error) {
      this.connectionState.isConnecting = false;
      this.notifyStateChange();
      throw error;
    }
  }

  // Disconnect from VPN
  async disconnect(): Promise<void> {
    if (!this.connectionState.isConnected && !this.connectionState.isConnecting) {
      return;
    }

    try {
      this.connectionState.isConnecting = false;

      if (this.connectionState.sessionId) {
        await mockApi.disconnect();
      }

      // Stop speed monitoring
      this.stopSpeedMonitoring();

      // Reset connection state
      this.connectionState = {
        isConnected: false,
        isConnecting: false,
        currentServer: null,
        downloadSpeed: 0,
        uploadSpeed: 0,
        ipAddress: 'Detecting...',
        sessionId: null,
        lastConnectedAt: null,
      };

      this.notifyStateChange();
    } catch (error) {
      // Even if disconnect fails, reset the state
      this.stopSpeedMonitoring();
      this.connectionState = {
        isConnected: false,
        isConnecting: false,
        currentServer: null,
        downloadSpeed: 0,
        uploadSpeed: 0,
        ipAddress: 'Detecting...',
        sessionId: null,
        lastConnectedAt: null,
      };
      this.notifyStateChange();
      throw error;
    }
  }

  // Start real-time speed monitoring
  private startSpeedMonitoring() {
    if (this.speedUpdateInterval) {
      clearInterval(this.speedUpdateInterval);
    }

    this.speedUpdateInterval = setInterval(async () => {
      if (this.connectionState.sessionId && this.connectionState.isConnected) {
        try {
          const speedData = await mockApi.getRealtimeSpeed(this.connectionState.sessionId);
          this.connectionState.downloadSpeed = speedData.download;
          this.connectionState.uploadSpeed = speedData.upload;
          this.notifyStateChange();
        } catch (error) {
          console.error('Speed monitoring error:', error);
        }
      }
    }, 3000); // Update every 3 seconds
  }

  // Stop speed monitoring
  private stopSpeedMonitoring() {
    if (this.speedUpdateInterval) {
      clearInterval(this.speedUpdateInterval);
      this.speedUpdateInterval = null;
    }
  }

  // Get available servers
  async getAvailableServers(): Promise<Server[]> {
    return await mockApi.getServers();
  }

  // Get recommended server
  async getRecommendedServer(): Promise<Server> {
    return await mockApi.getRecommendedServer();
  }

  // Perform speed test
  async performSpeedTest(): Promise<{ downloadSpeed: number; uploadSpeed: number; ping: number }> {
    if (!this.connectionState.currentServer) {
      throw new Error('No server selected');
    }

    const result = await mockApi.performSpeedTest(this.connectionState.currentServer.id);
    return {
      downloadSpeed: result.downloadSpeed,
      uploadSpeed: result.uploadSpeed,
      ping: result.ping,
    };
  }

  // Get current IP information
  async getCurrentIP(): Promise<{ ip: string; country: string; city: string; isp: string }> {
    return await mockApi.getCurrentIP();
  }

  // Check if kill switch should activate
  shouldActivateKillSwitch(): boolean {
    return this.settings.killSwitchEnabled && !this.connectionState.isConnected;
  }

  // Clean up resources
  cleanup() {
    this.stopSpeedMonitoring();
    this.onStateChangeCallbacks = [];
  }
}

export const vpnService = new VPNService();