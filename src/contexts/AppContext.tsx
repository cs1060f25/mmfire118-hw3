import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Hold, Session, SeatCluster } from '../types';
import { getStoredHolds, getStoredSessions, saveHolds, saveSessions } from '../data/mock';

interface AppContextType {
  activeHold: Hold | null;
  activeSession: Session | null;
  updateHolds: () => void;
  updateSessions: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  toast: { message: string; type: string; id: number } | null;
  hideToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [activeHold, setActiveHold] = useState<Hold | null>(null);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [toast, setToast] = useState<{ message: string; type: string; id: number } | null>(null);

  const updateHolds = () => {
    const holds = getStoredHolds();
    const now = Date.now();
    
    // Clean up expired holds
    const activeHolds = holds.filter(hold => {
      if (hold.state === 'expired' || now > hold.expiresAt) {
        hold.state = 'expired';
        return false;
      }
      return hold.state === 'active';
    });
    
    // Update expired holds
    const updatedHolds = holds.map(hold => {
      if (now > hold.expiresAt && hold.state === 'active') {
        return { ...hold, state: 'expired' as const };
      }
      return hold;
    });
    
    if (updatedHolds.some((h, i) => h.state !== holds[i]?.state)) {
      saveHolds(updatedHolds);
    }
    
    setActiveHold(activeHolds[0] || null);
  };

  const updateSessions = () => {
    const sessions = getStoredSessions();
    const now = Date.now();
    
    const activeSessions = sessions.filter(session => {
      if (session.status === 'ended' || now > session.endsAt + 180000) { // 3-minute grace
        return false;
      }
      return session.status === 'active';
    });
    
    // Auto-end sessions that have exceeded grace period
    const updatedSessions = sessions.map(session => {
      if (now > session.endsAt + 180000 && session.status === 'active') {
        return { ...session, status: 'ended' as const };
      }
      return session;
    });
    
    if (updatedSessions.some((s, i) => s.status !== sessions[i]?.status)) {
      saveSessions(updatedSessions);
    }
    
    setActiveSession(activeSessions[0] || null);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const toastId = Date.now();
    setToast({ message, type, id: toastId });
    
    setTimeout(() => {
      setToast(current => current?.id === toastId ? null : current);
    }, 3000);
  };

  const hideToast = () => setToast(null);

  useEffect(() => {
    updateHolds();
    updateSessions();
    
    const interval = setInterval(() => {
      updateHolds();
      updateSessions();
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider value={{
      activeHold,
      activeSession,
      updateHolds,
      updateSessions,
      showToast,
      toast,
      hideToast
    }}>
      {children}
    </AppContext.Provider>
  );
}