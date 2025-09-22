import { SeatCluster, Hold, Session, Filters, GroupRoom } from '../types';

export const mockSeatClusters: SeatCluster[] = [
  {
    id: 'main-lib-b1',
    name: 'Carrel Row B, Window',
    building: 'Main Library',
    level: '2F',
    etaMins: 3,
    confidence: 'High',
    hasPower: true,
    walkHoldEligible: true,
    coords: { x: 150, y: 120 },
    isQuiet: true
  },
  {
    id: 'main-lib-c2',
    name: 'Corner Study Nook',
    building: 'Main Library',
    level: '3F',
    etaMins: 4,
    confidence: 'Medium',
    hasPower: true,
    walkHoldEligible: true,
    coords: { x: 200, y: 80 },
    isQuiet: true
  },
  {
    id: 'stem-atrium-a1',
    name: 'Individual Pods A',
    building: 'STEM Atrium',
    level: '1F',
    etaMins: 6,
    confidence: 'High',
    hasPower: true,
    walkHoldEligible: true,
    coords: { x: 320, y: 150 },
    isQuiet: false
  },
  {
    id: 'stem-atrium-b3',
    name: 'Quiet Zone Tables',
    building: 'STEM Atrium',
    level: '2F',
    etaMins: 7,
    confidence: 'Low',
    hasPower: false,
    walkHoldEligible: false,
    coords: { x: 350, y: 100 },
    isQuiet: true
  },
  {
    id: 'union-reading-1',
    name: 'Reading Room East',
    building: 'Union',
    level: '3F',
    etaMins: 5,
    confidence: 'Medium',
    hasPower: true,
    walkHoldEligible: true,
    coords: { x: 100, y: 180 },
    isQuiet: true
  },
  {
    id: 'union-solo-2',
    name: 'Solo Study Carrels',
    building: 'Union',
    level: '2F',
    etaMins: 4,
    confidence: 'High',
    hasPower: true,
    walkHoldEligible: true,
    coords: { x: 80, y: 200 },
    isQuiet: true
  },
  {
    id: 'lib-annex-quiet',
    name: 'Silent Study Wing',
    building: 'Library Annex',
    level: '1F',
    etaMins: 8,
    confidence: 'High',
    hasPower: true,
    walkHoldEligible: true,
    coords: { x: 250, y: 220 },
    isQuiet: true
  },
  {
    id: 'eng-commons-1',
    name: 'Engineering Commons',
    building: 'Engineering',
    level: '1F',
    etaMins: 7,
    confidence: 'Medium',
    hasPower: true,
    walkHoldEligible: false,
    coords: { x: 380, y: 180 },
    isQuiet: false
  }
];

export const mockGroupRooms: GroupRoom[] = [
  {
    id: 'lib-group-a',
    name: 'Group Study A',
    building: 'Main Library',
    level: '2F',
    capacity: 4,
    hasWhiteboard: true,
    etaMins: 3,
    available: true
  },
  {
    id: 'union-collab-1',
    name: 'Collaboration Room 1',
    building: 'Union',
    level: '3F',
    capacity: 6,
    hasWhiteboard: true,
    etaMins: 5,
    available: false
  },
  {
    id: 'stem-team-room',
    name: 'Team Project Room',
    building: 'STEM Atrium',
    level: '2F',
    capacity: 8,
    hasWhiteboard: true,
    etaMins: 6,
    available: true
  }
];

// Local storage helpers
const STORAGE_KEYS = {
  FILTERS: 'nookscout-filters',
  HOLDS: 'nookscout-holds',
  SESSIONS: 'nookscout-sessions',
  SEAT_STATES: 'nookscout-seat-states'
};

export const defaultFilters: Filters = {
  studyType: 'solo',
  quiet: true,
  power: true,
  maxWalkMins: 5,
  walkHoldOnly: true
};

export function getStoredFilters(): Filters {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FILTERS);
    return stored ? { ...defaultFilters, ...JSON.parse(stored) } : defaultFilters;
  } catch {
    return defaultFilters;
  }
}

export function saveFilters(filters: Filters): void {
  localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(filters));
}

export function getStoredHolds(): Hold[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.HOLDS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveHolds(holds: Hold[]): void {
  localStorage.setItem(STORAGE_KEYS.HOLDS, JSON.stringify(holds));
}

export function getStoredSessions(): Session[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveSessions(sessions: Session[]): void {
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
}

export function getSeatStates(): Record<string, { held: boolean; occupied: boolean }> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SEAT_STATES);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function saveSeatStates(states: Record<string, { held: boolean; occupied: boolean }>): void {
  localStorage.setItem(STORAGE_KEYS.SEAT_STATES, JSON.stringify(states));
}

export function rankSeats(filters: Filters): SeatCluster[] {
  const seatStates = getSeatStates();
  
  let filtered = mockSeatClusters.filter(seat => {
    if (seat.etaMins > filters.maxWalkMins) return false;
    if (filters.power && !seat.hasPower) return false;
    if (filters.quiet && seat.isQuiet === false) return false;
    if (filters.walkHoldOnly && !seat.walkHoldEligible) return false;
    
    const state = seatStates[seat.id];
    if (state?.held || state?.occupied) return false;
    
    return true;
  });

  // Apply seat states
  filtered = filtered.map(seat => {
    const state = seatStates[seat.id];
    return {
      ...seat,
      currentlyHeld: state?.held || false,
      currentlyOccupied: state?.occupied || false
    };
  });

  // Sort by confidence (High > Medium > Low) then by ETA
  const confidenceWeight = { High: 3, Medium: 2, Low: 1 };
  
  return filtered.sort((a, b) => {
    const confDiff = confidenceWeight[b.confidence] - confidenceWeight[a.confidence];
    if (confDiff !== 0) return confDiff;
    
    // If confidence is similar, boost underused seats slightly
    const aUnderused = a.confidence === 'Low' ? -0.5 : 0;
    const bUnderused = b.confidence === 'Low' ? -0.5 : 0;
    
    return (a.etaMins + aUnderused) - (b.etaMins + bUnderused);
  });
}

export function startHold(seatId: string): Hold {
  const holdId = `hold-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const startedAt = Date.now();
  const durationSec = 600; // 10 minutes
  
  const hold: Hold = {
    id: holdId,
    seatId,
    startedAt,
    durationSec,
    expiresAt: startedAt + (durationSec * 1000),
    state: 'active'
  };
  
  const currentHolds = getStoredHolds();
  currentHolds.push(hold);
  saveHolds(currentHolds);
  
  // Update seat state
  const seatStates = getSeatStates();
  seatStates[seatId] = { held: true, occupied: false };
  saveSeatStates(seatStates);
  
  return hold;
}

export function extendHold(holdId: string): Hold | null {
  const holds = getStoredHolds();
  const holdIndex = holds.findIndex(h => h.id === holdId);
  
  if (holdIndex === -1) return null;
  
  const hold = holds[holdIndex];
  if (hold.extended || hold.state !== 'active') return null;
  
  hold.extended = true;
  hold.durationSec += 180; // Add 3 minutes
  hold.expiresAt = hold.startedAt + (hold.durationSec * 1000);
  
  holds[holdIndex] = hold;
  saveHolds(holds);
  
  return hold;
}

export function arriveAndVerify(holdId: string): Session | null {
  const holds = getStoredHolds();
  const holdIndex = holds.findIndex(h => h.id === holdId);
  
  if (holdIndex === -1) return null;
  
  const hold = holds[holdIndex];
  hold.state = 'arrived';
  holds[holdIndex] = hold;
  saveHolds(holds);
  
  // Create session
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const startedAt = Date.now();
  const durationSec = 2700; // 45 minutes
  
  const session: Session = {
    id: sessionId,
    seatId: hold.seatId,
    startedAt,
    durationSec,
    endsAt: startedAt + (durationSec * 1000),
    status: 'active'
  };
  
  const currentSessions = getStoredSessions();
  currentSessions.push(session);
  saveSessions(currentSessions);
  
  // Update seat state
  const seatStates = getSeatStates();
  seatStates[hold.seatId] = { held: false, occupied: true };
  saveSeatStates(seatStates);
  
  return session;
}

export function extendSession(sessionId: string): Session | null {
  const sessions = getStoredSessions();
  const sessionIndex = sessions.findIndex(s => s.id === sessionId);
  
  if (sessionIndex === -1) return null;
  
  const session = sessions[sessionIndex];
  if (session.extended || session.status !== 'active') return null;
  
  session.extended = true;
  session.durationSec += 900; // Add 15 minutes
  session.endsAt = session.startedAt + (session.durationSec * 1000);
  
  sessions[sessionIndex] = session;
  saveSessions(sessions);
  
  return session;
}

export function endSession(sessionId: string): void {
  const sessions = getStoredSessions();
  const sessionIndex = sessions.findIndex(s => s.id === sessionId);
  
  if (sessionIndex === -1) return;
  
  const session = sessions[sessionIndex];
  session.status = 'ended';
  sessions[sessionIndex] = session;
  saveSessions(sessions);
  
  // Update seat state
  const seatStates = getSeatStates();
  if (seatStates[session.seatId]) {
    seatStates[session.seatId].occupied = false;
  }
  saveSeatStates(seatStates);
}

export function flagSeat(seatId: string): void {
  const seatStates = getSeatStates();
  if (seatStates[seatId]) {
    seatStates[seatId] = { held: false, occupied: false };
  } else {
    seatStates[seatId] = { held: false, occupied: false };
  }
  saveSeatStates(seatStates);
  
  // In a real app, this would mark for staff review
  console.log(`Seat ${seatId} flagged for staff review`);
}

export function releaseSeat(seatId: string): void {
  const seatStates = getSeatStates();
  if (seatStates[seatId]) {
    seatStates[seatId] = { held: false, occupied: false };
    saveSeatStates(seatStates);
  }
}

export function cancelHold(holdId: string): void {
  const holds = getStoredHolds();
  const idx = holds.findIndex(h => h.id === holdId);
  if (idx === -1) return;
  const hold = holds[idx];
  // Mark as expired and save
  holds[idx] = { ...hold, state: 'expired' } as Hold;
  saveHolds(holds);
  // Clear seat held state
  const seatStates = getSeatStates();
  if (seatStates[hold.seatId]) {
    seatStates[hold.seatId].held = false;
    saveSeatStates(seatStates);
  }
}