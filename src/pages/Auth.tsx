
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AuthForm from '@/components/AuthForm';

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          navigate('/dashboard');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

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
