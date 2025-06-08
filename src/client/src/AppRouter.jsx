import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import InboxPage from './pages/jsx/InboxPage';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import LoginPage from './pages/jsx/LoginPage';
import RegisterPage from './pages/jsx/RegisterPage';
import { useContext } from 'react';

// Protected Route component
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function HomeRedirect() {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn ? <Navigate to="/inbox" replace /> : <Navigate to="/login" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/inbox" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/inbox" 
            element={
              <ProtectedRoute>
                <InboxPage />
              </ProtectedRoute>
            } 
          />
          {/* Add other protected routes here */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
