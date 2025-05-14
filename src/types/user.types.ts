export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PushSubscription {
  id: string;
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  language: string;
  timezone: string;
  currency: string;
  theme: 'light' | 'dark' | 'system';
}

export interface ProfileUpdateDto {
  firstName?: string;
  lastName?: string;
  bio?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  avatar?: string;
}
