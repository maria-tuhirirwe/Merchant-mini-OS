import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import InstallPrompt from './components/common/InstallPrompt';

import Login     from './pages/auth/Login';
import Signup    from './pages/auth/Signup';
import Dashboard from './pages/Dashboard';
import AddTransaction     from './pages/AddTransaction';
import TransactionHistory from './pages/TransactionHistory';
import Categories from './pages/Categories';
import Profile    from './pages/Profile';

// Guards
function PrivateRoute({ children }) {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"  element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

      {/* Protected */}
      <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/add"        element={<PrivateRoute><AddTransaction /></PrivateRoute>} />
      <Route path="/history"    element={<PrivateRoute><TransactionHistory /></PrivateRoute>} />
      <Route path="/categories" element={<PrivateRoute><Categories /></PrivateRoute>} />
      <Route path="/profile"    element={<PrivateRoute><Profile /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
        <InstallPrompt />
      </BrowserRouter>
    </AppProvider>
  );
}
