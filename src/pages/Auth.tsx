
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AuthForm from '@/components/AuthForm';
import { Spinner } from '@/components/ui/spinner';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          navigate('/dashboard', { replace: true });
        }
        
        setIsCheckingAuth(false);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Use setTimeout to prevent potential state update loops
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 0);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" className="text-indigo-500" />
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <header className="py-6 px-4">
        <div className="container mx-auto">
          <a href="/" className="text-2xl font-bold gradient-text">Memesense</a>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </main>
      
      <footer className="py-6 px-4 text-center text-gray-500 text-sm">
        <div className="container mx-auto">
          <p>© 2025 Memesense. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Auth;
