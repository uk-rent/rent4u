import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { UserProfile, UserRole, UserWithProfile } from '@/types/user.types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  userRole: UserRole | null; 
  session: any | null; 
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: { email: string, password: string, firstName?: string, lastName?: string, userType?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<UserProfile>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmPasswordReset: (token: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null); 
  const [session, setSession] = useState<any | null>(null); 
  const [loading, setLoading] = useState(true);
  
  // Get the navigate function safely with a try/catch
  let navigate;
  try {
    navigate = useNavigate();
  } catch (error) {
    console.error("Router not available:", error);
    // Provide a no-op navigate function as fallback
    navigate = (to: string) => {
      console.warn("Navigation attempted but router not available:", to);
    };
  }

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session) {
          const { data: userWithProfile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          // Map from Supabase profile format to our UserProfile format
          const mappedUser: UserProfile = {
            id: session.user.id,
            email: session.user.email || undefined,
            firstName: userWithProfile?.first_name || undefined,
            lastName: userWithProfile?.last_name || undefined,
            role: userWithProfile?.role || 'tenant',
            avatar: userWithProfile?.avatar_url || undefined,
            phone: userWithProfile?.phone || undefined,
            createdAt: userWithProfile?.created_at || undefined,
            updatedAt: userWithProfile?.updated_at || undefined
          };

          setUser(mappedUser);
          setUserRole(mappedUser.role || null);
          setSession(session);
        }
      } catch (error) {
        console.error('Error checking authentication', error);
        setUser(null);
        setUserRole(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Set up auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Map user profile data
          const { data: userWithProfile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          // Map from Supabase profile format to our UserProfile format
          const mappedUser: UserProfile = {
            id: session.user.id,
            email: session.user.email || undefined,
            firstName: userWithProfile?.first_name || undefined,
            lastName: userWithProfile?.last_name || undefined,
            role: userWithProfile?.role || 'tenant',
            avatar: userWithProfile?.avatar_url || undefined,
            phone: userWithProfile?.phone || undefined,
            createdAt: userWithProfile?.created_at || undefined,
            updatedAt: userWithProfile?.updated_at || undefined
          };

          setUser(mappedUser);
          setUserRole(mappedUser.role || null);
          setSession(session);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserRole(null);
          setSession(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fix the signIn function to match the interface
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: 'Welcome back!',
        description: 'You have been successfully signed in.',
      });
      
      if (navigate) navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Sign in failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Fix the signUp function to match the interface
  const signUp = async ({
    email,
    password,
    firstName,
    lastName,
    userType = 'tenant'
  }: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    userType?: string;
  }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: userType || 'tenant',
          },
        },
      });

      if (error) throw error;

      toast({
        title: 'Sign up successful!',
        description:
          'Please check your email for a verification link to complete your registration.',
      });

      if (navigate) navigate('/auth/login');
    } catch (error: any) {
      toast({
        title: 'Sign up failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Keep existing signOut function but add navigate check
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setUser(null);
      setUserRole(null);
      setSession(null);
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
      
      if (navigate) navigate('/');
    } catch (error: any) {
      toast({
        title: 'Sign out failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Keep existing updateUser function (no navigate needed)
  const updateUser = async (userData: Partial<UserProfile>) => {
    if (!user) return;

    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName,
          avatar_url: userData.avatar,
          phone: userData.phone,
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local user state
      setUser({
        ...user,
        ...userData,
      });

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Profile update failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Keep existing resetPassword function (navigate check added)
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: 'Password reset email sent',
        description:
          'Please check your email for a link to reset your password.',
      });
    } catch (error: any) {
      toast({
        title: 'Password reset failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Add the missing confirmPasswordReset function (navigate check added)
  const confirmPasswordReset = async (token: string, password: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(password, {
        redirectTo: `${window.location.origin}/auth/login`,
      });

      if (error) throw error;

      toast({
        title: 'Password reset successful',
        description: 'Your password has been reset successfully.',
      });
      
      if (navigate) navigate('/auth/login');
    } catch (error: any) {
      toast({
        title: 'Password reset failed',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        updateUser,
        resetPassword,
        confirmPasswordReset
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
