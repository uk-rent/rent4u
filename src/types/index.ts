
import { User } from '@supabase/supabase-js';

export type UserRole = 'tenant' | 'landlord' | 'admin';

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

export interface PropertyImage {
  url: string;
  alt?: string;
  public_id?: string; // ID de Cloudinary
}

export interface Amenity {
  name: string;
  icon?: string;
}

export interface PropertyFeatures {
  petsAllowed?: boolean;
  furnished?: boolean;
  airConditioning?: boolean;
  heating?: boolean;
  parking?: boolean;
  elevator?: boolean;
  balcony?: boolean;
  garden?: boolean;
  swimmingPool?: boolean;
  securitySystem?: boolean;
  internet?: boolean;
  washingMachine?: boolean;
  dishwasher?: boolean;
  [key: string]: boolean | undefined;
}

export type PropertyType = 
  | 'apartment' 
  | 'house' 
  | 'room' 
  | 'studio' 
  | 'commercial' 
  | 'land' 
  | 'other';

export type PropertyStatus = 'draft' | 'published' | 'rented' | 'archived' | 'expired' | 'active' | 'inactive' | 'pending';

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  area?: string;
  postcode?: string;
  city?: string;
  country?: string;
  latitude?: number | null;
  longitude?: number | null;
  price: number;
  currency?: string;
  beds?: number;
  baths?: number;
  propertyType?: PropertyType | string;
  status: PropertyStatus;
  is_draft?: boolean;
  is_featured?: boolean;
  featured_until?: string;
  ad_type?: string;
  owner_id?: string | null;
  images: PropertyImage[];
  amenities?: Amenity[];
  features?: PropertyFeatures;
  created_at: string;
  updated_at: string;
  available?: string;
  listing_expires_at?: string;
  views_count?: number;
  contact_clicks?: number;
}

// Re-exportamos todos los tipos de los otros archivos
export * from './user.types';
export * from './subscription.types';
export * from './property.types';
export * from './payment.types';
export * from './notification.types';
export * from './api.types';
