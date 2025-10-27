export interface Server {
  id: string;
  country: string;
  countryCode: string;
  city: string;
  speed: number; // Mbps
  ping: number; // ms
  load: number; // percentage 0-100
  latitude?: number;
  longitude?: number;
}

export interface ServerLoad {
  serverId: string;
  load: number;
  users: number;
  lastUpdated: Date;
}

export interface ServerStatus {
  serverId: string;
  isOnline: boolean;
  lastSeen: Date;
  uptime: number; // percentage
}