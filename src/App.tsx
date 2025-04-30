import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { HomePage } from '@/pages/home';
import { LoginPage } from '@/pages/auth/login';
import { RegisterPage } from '@/pages/auth/register';
import { RestaurantDashboard } from '@/pages/dashboard/restaurant';
import { NgoDashboard } from '@/pages/dashboard/ngo';
import { NewFoodListing } from '@/pages/dashboard/restaurant/new-food';
import { Settings } from '@/pages/dashboard/settings';
import { DonationHistory } from '@/pages/dashboard/history';
import { AuthProvider } from '@/components/auth/auth-provider';
import { useAuth } from '@/lib/auth';
import DeliveryLogin from './pages/DeliveryLogin';
import DeliveryDashboard from './pages/DeliveryDashboard';
import DeliveryTracking from './pages/DeliveryTracking';
import DeliveryCompletion from './pages/DeliveryCompletion';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';

// Protected route component that checks user role
const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole?: 'restaurant' | 'ngo' }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && user.user_metadata.role !== allowedRole) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

// Dashboard router that redirects to the appropriate dashboard based on user role
const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return user.user_metadata.role === 'restaurant' ? 
    <Navigate to="/dashboard/restaurant" /> : 
    <Navigate to="/dashboard/ngo" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardRouter />} />
              <Route path="/delivery-login" element={<DeliveryLogin />} />
              <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
              <Route path="/delivery-tracking/:orderId" element={<DeliveryTracking />} />
              <Route path="/delivery-completion" element={<DeliveryCompletion />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route 
                path="/dashboard/restaurant" 
                element={
                  <ProtectedRoute allowedRole="restaurant">
                    <RestaurantDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/ngo" 
                element={
                  <ProtectedRoute allowedRole="ngo">
                    <NgoDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/food/new" 
                element={
                  <ProtectedRoute allowedRole="restaurant">
                    <NewFoodListing />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/history" 
                element={
                  <ProtectedRoute>
                    <DonationHistory />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;