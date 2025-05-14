
export type UserRole = 'admin' | 'landlord' | 'tenant' | 'guest';

export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  avatar?: string; // Added for backward compatibility
  bio?: string; // Added bio field
  role: UserRole;
  createdAt: Date | string;
  updatedAt?: Date | string;
  profile?: any; // Added for backward compatibility with some components
}

export interface UserSettings {
  id: string;
  userId: string;
  darkMode: boolean;
  notifications: boolean;
  pushNotifications: boolean; // Added missing property
  emailNotifications: boolean;
  marketingEmails: boolean;
  timezone: string;
  currency: string;
  language: string;
}

// Add missing ProfileUpdateDto type
export interface ProfileUpdateDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  avatarUrl?: string;
}

// Add missing PushSubscription type
export interface PushSubscription {
  id: string;
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  createdAt: string;
  updatedAt: string;
}

// For backward compatibility with AuthContext
export type UserWithProfile = UserProfile;
