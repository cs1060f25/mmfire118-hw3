export interface SeatCluster {
  id: string;
  name: string;
  building: string;
  level: string;
  etaMins: number;
  confidence: 'Low' | 'Medium' | 'High';
  hasPower: boolean;
  walkHoldEligible: boolean;
  flagged?: boolean;
  coords: { x: number; y: number };
  currentlyHeld?: boolean;
  currentlyOccupied?: boolean;
  isQuiet?: boolean;
}

export interface Hold {
  id: string;
  seatId: string;
  startedAt: number;
  durationSec: number;
  extended?: boolean;
  expiresAt: number;
  state: 'active' | 'expired' | 'arrived';
}

export interface Session {
  id: string;
  seatId: string;
  startedAt: number;
  durationSec: number;
  extended?: boolean;
  endsAt: number;
  status: 'active' | 'ended';
}

export interface Filters {
  studyType: 'solo' | 'group';
  quiet: boolean;
  power: boolean;
  maxWalkMins: number;
  walkHoldOnly: boolean;
}

export interface GroupRoom {
  id: string;
  name: string;
  building: string;
  level: string;
  capacity: number;
  hasWhiteboard: boolean;
  etaMins: number;
  available: boolean;
}