import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing-page.jsx';
import ThankYou from './pages/thank-you.jsx';
import AdminLogin from './pages/admin-login.jsx';
import Dashboard from './pages/dashboard.jsx';

function App() {
  return (
    <Router basename="/landing-page" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
