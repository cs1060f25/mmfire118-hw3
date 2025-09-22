import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { Toast } from './components/Toast';
import { Home } from './pages/Home';
import { Find } from './pages/Find';
import { SeatDetails } from './pages/SeatDetails';
import { Arrival } from './pages/Arrival';
import { Session } from './pages/Session';
import { GroupRoom } from './pages/GroupRoom';

function AppContent() {
  const { toast, hideToast } = useApp();

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find" element={<Find />} />
          <Route path="/seat/:id" element={<SeatDetails />} />
          <Route path="/arrival/:holdId" element={<Arrival />} />
          <Route path="/session/:sessionId" element={<Session />} />
          <Route path="/room" element={<GroupRoom />} />
        </Routes>
      </Router>
      
      {toast && toast.message && (
        <Toast
          message={toast.message}
          type={toast.type as 'success' | 'error' | 'info'}
          onClose={hideToast}
        />
      )}
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;