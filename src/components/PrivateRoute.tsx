import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/config/supabase';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  const initialCheckDone = useRef(false);

  useEffect(() => {
    let isMounted = true;
    
    // Initial session check - only run once
    const initializeAuth = async () => {
      if (initialCheckDone.current) return;
      initialCheckDone.current = true;
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth check error:', error);
          if (isMounted) {
            setIsAuthenticated(false);
            setLoading(false);
          }
          return;
        }
        
        if (isMounted) {
          setIsAuthenticated(!!session?.user);
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (isMounted) {
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    };
    
    // Listen for auth state changes (for logout, token refresh etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        
        // Skip INITIAL_SESSION as we handle it separately to avoid race conditions
        if (event === 'INITIAL_SESSION') return;
        
        // Handle sign out
        if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setLoading(false);
        }
        // Handle sign in and token refresh
        else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setIsAuthenticated(!!session?.user);
          setLoading(false);
        }
      }
    );
    
    initializeAuth();
    
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Show loading spinner while checking auth
  if (loading || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;