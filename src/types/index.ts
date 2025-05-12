
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
  alt: string;
}

export interface Amenity {
  name: string;
  icon?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  area: string;
  postcode: string;
  latitude: number | null;
  longitude: number | null;
  price: number;
  beds: number;
  baths: number;
  propertyType: string;
  status: 'active' | 'inactive' | 'pending';
  is_draft: boolean;
  is_featured: boolean;
  owner_id: string | null;
  images: PropertyImage[];
  amenities: Amenity[];
  created_at: string;
  updated_at: string;
  available: string;
}
