
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserWithProfile, UserRole } from '@/types/user.types';

type AuthContextType = {
  session: Session | null;
  user: UserWithProfile | null;
  userRole: UserRole | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string, role: UserRole) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { first_name?: string; last_name?: string; phone?: string; avatar_url?: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserWithProfile | null>(null);
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

  const signUp = async (email: string, password: string, firstName: string, lastName: string, role: UserRole) => {
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
          title: 'Error de registro',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Registro exitoso',
        description: 'Tu cuenta ha sido creada con éxito.',
      });
      
    } catch (error: any) {
      toast({
        title: 'Error inesperado',
        description: error.message || 'Ha ocurrido un error inesperado',
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
          title: 'Error de inicio de sesión',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Sesión iniciada',
        description: '¡Bienvenido de nuevo!',
      });
      
    } catch (error: any) {
      toast({
        title: 'Error inesperado',
        description: error.message || 'Ha ocurrido un error inesperado',
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
          title: 'Error al cerrar sesión',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión con éxito',
      });
    } catch (error: any) {
      toast({
        title: 'Error inesperado',
        description: error.message || 'Ha ocurrido un error inesperado',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
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

  const value = {
    session,
    user,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
