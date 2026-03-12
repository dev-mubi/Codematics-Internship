import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import { store } from './store';
import { queryClient } from './lib/queryClient';
import { supabase } from './services/supabase';
import { setUser, setSession, setLoading } from './store/slices/authSlice';

import ProtectedRoute from './components/auth/ProtectedRoute';
import PageWrapper from './components/layout/PageWrapper';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import MovieDetail from './pages/MovieDetail';
import Watchlist from './pages/Watchlist';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOTP from './pages/VerifyOTP';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Navbar from './components/layout/Navbar';
import { AnimatePresence } from 'framer-motion';

function AppContent() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);
  const location = useLocation();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setSession(session));
      dispatch(setUser(session?.user ?? null));
      dispatch(setLoading(false));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session));
      dispatch(setUser(session?.user ?? null));
      dispatch(setLoading(false));
    });

    return () => subscription.unsubscribe();
  }, [dispatch, theme]);

  return (
    <div className={`min-h-screen bg-background text-primary transition-colors duration-300 ${theme}`}>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/catalog" element={<PageWrapper><Catalog /></PageWrapper>} />
          <Route path="/movie/:id" element={<PageWrapper><MovieDetail /></PageWrapper>} />
          
          <Route path="/watchlist" element={
            <ProtectedRoute>
              <PageWrapper><Watchlist /></PageWrapper>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <PageWrapper><Profile /></PageWrapper>
            </ProtectedRoute>
          } />

          <Route path="/privacy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
          <Route path="/terms" element={<PageWrapper><TermsOfService /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#111118',
          color: '#F0F0F5',
          border: '1px solid #1E1E2A',
        },
        duration: 3000,
      }} />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppContent />
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
