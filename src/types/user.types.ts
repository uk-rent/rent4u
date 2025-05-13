
import { User as SupabaseUser } from '@supabase/supabase-js';

// Tipo de rol de usuario correspondiente al enum de la base de datos
export type UserRole = 'tenant' | 'landlord' | 'admin';

// Perfil de usuario extendido
export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

// Usuario con perfil para usar en la aplicación
export interface UserWithProfile extends SupabaseUser {
  profile?: Profile;
}

// Suscripción Push
export interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at: string;
}
