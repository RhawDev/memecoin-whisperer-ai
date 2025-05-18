
import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const AuthGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Check for an existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (isMounted) {
          const authenticated = !!session;
          setIsAuthenticated(authenticated);
          setIsLoading(false);
          setCheckComplete(true);
          
          if (!authenticated) {
            navigate('/auth', { replace: true });
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        if (isMounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
          setCheckComplete(true);
          navigate('/auth', { replace: true });
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        const authenticated = !!session;
        setIsAuthenticated(authenticated);
        setIsLoading(false);
        
        if (!authenticated && checkComplete) {
          navigate('/auth', { replace: true });
        }
      }
    });

    checkSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen p-6">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-[500px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : null;
};

export default AuthGuard;
