
export type UserRole = 'tenant' | 'landlord' | 'admin';

export interface UserProfile {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  avatar?: string;
  phone?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserWithProfile {
  id: string;
  email?: string;
  profile?: {
    id: string;
    first_name?: string;
    last_name?: string;
    role: UserRole;
    avatar_url?: string;
    phone?: string;
    created_at: string;
    updated_at: string;
  };
}

export interface ProfileUpdateDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
}

export interface UserSettings {
  id: string;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;  // Added property
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;  // Added property
  currency: string;  // Added property
  createdAt: string;
  updatedAt: string;
}

export interface PushSubscription {
  id: string;
  userId: string;  // Changed from user_id to match the type
  endpoint: string;
  p256dh: string;
  auth: string;
  createdAt: string;  // Changed from created_at to match the type
  updatedAt: string;  // Changed from updated_at to match the type
}
