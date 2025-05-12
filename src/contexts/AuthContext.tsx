
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userRole: 'tenant' | 'landlord' | 'admin' | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string, role: 'tenant' | 'landlord') => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'tenant' | 'landlord' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Use setTimeout to prevent potential deadlocks
          setTimeout(async () => {
            const { data, error } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', currentSession.user.id)
              .single();
              
            if (error) {
              console.error('Error fetching user role:', error);
              return;
            }
            
            if (data) {
              setUserRole(data.role);
            }
          }, 0);
        } else {
          setUserRole(null);
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        supabase
          .from('profiles')
          .select('role')
          .eq('id', initialSession.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error('Error fetching user role:', error);
              return;
            }
            
            if (data) {
              setUserRole(data.role);
            }
            
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string, role: 'tenant' | 'landlord') => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role
          }
        }
      });

      if (error) {
        toast({
          title: 'Registration Error',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Registration Successful',
        description: 'Your account has been created successfully.',
      });
      
    } catch (error: any) {
      toast({
        title: 'Unexpected Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: 'Login Error',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      
    } catch (error: any) {
      toast({
        title: 'Unexpected Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: 'Logout Error',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Logged Out',
        description: 'You have been logged out successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Unexpected Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
