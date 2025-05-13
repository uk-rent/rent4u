import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserWithProfile, UserRole, UserProfile } from '@/types/user.types';

interface AuthContextType {
  session: Session | null;
  user: UserProfile | null;
  userRole: UserRole | null;
  loading: boolean;
  signUp: (data: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { first_name?: string; last_name?: string; phone?: string; avatar_url?: string }) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmPasswordReset: (token: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para cargar el perfil completo del usuario desde Supabase
  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Unexpected error loading user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Crear una versión extendida del usuario con profile como null inicialmente
          const userWithProfile: UserWithProfile = {
            ...currentSession.user,
            profile: undefined
          };
          
          setUser(userWithProfile);
          
          // Usar setTimeout para prevenir deadlocks potenciales
          setTimeout(async () => {
            const profileData = await loadUserProfile(currentSession.user.id);
              
            if (profileData) {
              // Actualizar el usuario con los datos del perfil
              setUser(prevUser => 
                prevUser ? { ...prevUser, profile: profileData } : null
              );
              setUserRole(profileData.role);
            }
          }, 0);
        } else {
          setUser(null);
          setUserRole(null);
        }
      }
    );

    // Verificación inicial de sesión
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      setSession(initialSession);
      
      if (initialSession?.user) {
        // Crear una versión extendida del usuario con profile como null inicialmente
        const userWithProfile: UserWithProfile = {
          ...initialSession.user,
          profile: undefined
        };
        
        setUser(userWithProfile);
        
        const profileData = await loadUserProfile(initialSession.user.id);
          
        if (profileData) {
          // Actualizar el usuario con los datos del perfil
          setUser(prevUser => 
            prevUser ? { ...prevUser, profile: profileData } : null
          );
          setUserRole(profileData.role);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (data: any) => {
    try {
      // Aquí iría la llamada a la API para registrarse
      // const response = await api.signUp(data);
      // setUser(response.data.user);
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Aquí iría la llamada a la API para iniciar sesión
      // const response = await api.signIn(email, password);
      // setUser(response.data.user);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Aquí iría la llamada a la API para cerrar sesión
      // await api.signOut();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (data: { first_name?: string; last_name?: string; phone?: string; avatar_url?: string }) => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      // Re-cargar el perfil después de la actualización
      const profileData = await loadUserProfile(user.id);
      
      if (profileData) {
        setUser(prevUser => 
          prevUser ? { ...prevUser, profile: profileData } : null
        );
      }
      
      toast({
        title: 'Perfil actualizado',
        description: 'Tu perfil se ha actualizado con éxito',
      });
    } catch (error: any) {
      toast({
        title: 'Error al actualizar el perfil',
        description: error.message || 'Ha ocurrido un error inesperado',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Aquí iría la llamada a la API para solicitar el restablecimiento de contraseña
      // await api.resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const confirmPasswordReset = async (token: string, password: string) => {
    try {
      // Aquí iría la llamada a la API para confirmar el restablecimiento de contraseña
      // await api.confirmPasswordReset(token, password);
    } catch (error) {
      throw error;
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
    updateProfile,
    resetPassword,
    confirmPasswordReset,
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
