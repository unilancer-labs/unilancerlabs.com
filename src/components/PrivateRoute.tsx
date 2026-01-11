import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/config/supabase';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const authCheckDone = useRef(false);

  useEffect(() => {
    // Prevent multiple auth checks
    if (authCheckDone.current) return;
    
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          setIsAuthenticated(!!session?.user);
          setLoading(false);
          authCheckDone.current = true;
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (isMounted) {
          setIsAuthenticated(false);
          setLoading(false);
          authCheckDone.current = true;
        }
      }
    };
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        // Only handle meaningful events to prevent loops
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setIsAuthenticated(!!session?.user);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    );
    
    // Set timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isMounted && loading) {
        setIsAuthenticated(false);
        setLoading(false);
        authCheckDone.current = true;
      }
    }, 5000);
    
    checkAuth();
    
    return () => {
      isMounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;