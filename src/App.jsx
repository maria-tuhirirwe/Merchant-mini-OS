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
import Loans      from './pages/Loans';
import AddLoan    from './pages/AddLoan';
import LoanDetail from './pages/LoanDetail';
import Insights   from './pages/Insights';

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
      <Route path="/loans"      element={<PrivateRoute><Loans /></PrivateRoute>} />
      <Route path="/loans/add"  element={<PrivateRoute><AddLoan /></PrivateRoute>} />
      <Route path="/loans/:id"  element={<PrivateRoute><LoanDetail /></PrivateRoute>} />
      <Route path="/insights"   element={<PrivateRoute><Insights /></PrivateRoute>} />

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
