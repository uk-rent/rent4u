export type UserRole = 'admin' | 'landlord' | 'tenant' | 'guest';

export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface UserSettings {
  id: string;
  userId: string;
  darkMode: boolean;
  notifications: boolean;
  emailNotifications: boolean;
  marketingEmails: boolean;
  timezone: string;
  currency: string;
  language: string;
}
