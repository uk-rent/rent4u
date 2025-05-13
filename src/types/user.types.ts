import { User as SupabaseUser } from '@supabase/supabase-js';

// Tipo de rol de usuario correspondiente al enum de la base de datos
export type UserRole = 'tenant' | 'landlord' | 'admin';

// Perfil de usuario extendido
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

// Usuario con perfil para usar en la aplicación
export interface UserWithProfile extends SupabaseUser {
  profile?: UserProfile;
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

export interface UserSettings {
  id: string;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  language: string;
  timezone: string;
  currency: string;
}

export interface ProfileUpdateDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
}

export interface SettingsUpdateDto {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  marketingEmails?: boolean;
  language?: string;
  timezone?: string;
  currency?: string;
}
