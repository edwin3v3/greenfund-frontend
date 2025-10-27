// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'; // 1. BrowserRouter is removed
import { useAuth } from './contexts/AuthContext';
import { AnimatePresence } from 'framer-motion';

// ... (all your page imports: AppLayout, PublicLayout, Login, Dashboard, etc.) ...
import AppLayout from './components/AppLayout';
import PublicLayout from './components/PublicLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyFarmsPage from './pages/MyFarmsPage';
import FarmDetail from './pages/FarmDetail';
import SoilHealthPage from './pages/SoilHealthPage';
import SoilFarmSelection from './pages/SoilFarmSelection';
import ForumListPage from './pages/ForumListPage';
import ForumThreadPage from './pages/ForumThreadPage';
import ChatbotPage from './pages/ChatbotPage';
import SettingsPage from './pages/SettingsPage';
import BadgesPage from './pages/BadgesPage'; // Import the BadgesPage

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
    const { token } = useAuth();
    return token ? <Navigate to="/app/dashboard" replace /> : children;
}

function App() {
  return (
    // 2. <Router> tag is REMOVED from here
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
        </Route>

        {/* Protected Routes */}
        <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="my-farms" element={<MyFarmsPage />} />
          <Route path="farms/:id" element={<FarmDetail />} />
          <Route path="soil-analysis" element={<SoilFarmSelection />} />
          <Route path="farms/:id/soil" element={<SoilHealthPage />} />
          <Route path="forum" element={<ForumListPage />} />
          <Route path="forum/threads/:threadId" element={<ForumThreadPage />} />
          <Route path="chatbot" element={<ChatbotPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="badges" element={<BadgesPage />} /> {/* Route for badges */}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
    // 3. Closing </Router> tag is REMOVED from here
  );
}

export default App;