import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import DeveloperDashboard from './components/Developer/DeveloperDashboard';
import AgentDashboard from './components/Agent/AgentDashboard';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/developer/dashboard" element={
        <ProtectedRoute allowedRoles={['DEVELOPER']}>
          <DeveloperDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/agent/dashboard" element={
        <ProtectedRoute allowedRoles={['AGENT']}>
          <AgentDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/unauthorized" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Unauthorized</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      } />
      
      <Route path="/" element={
        isAuthenticated && user ? (
          user.role === 'DEVELOPER' ? (
            <Navigate to="/developer/dashboard" replace />
          ) : user.role === 'AGENT' ? (
            <Navigate to="/agent/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;