
import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

const AuthGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        const authenticated = !!session;
        setIsAuthenticated(authenticated);
        setIsLoading(false);
        
        if (!authenticated && !location.pathname.includes('/auth')) {
          navigate('/auth', { replace: true });
        }
      }
    });

    // Then check for an existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (isMounted) {
          const authenticated = !!session;
          setIsAuthenticated(authenticated);
          setIsLoading(false);
          
          if (!authenticated) {
            navigate('/auth', { replace: true });
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        if (isMounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
          navigate('/auth', { replace: true });
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" className="text-indigo-500" />
          <p className="text-gray-400">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : null;
};

export default AuthGuard;
