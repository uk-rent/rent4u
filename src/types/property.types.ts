
// Tipo de propiedad
export type PropertyType = 
  | 'apartment' 
  | 'house' 
  | 'room' 
  | 'studio' 
  | 'commercial' 
  | 'land' 
  | 'other';

// Estado de disponibilidad de la propiedad
export type PropertyStatus = 
  | 'draft'     // Borrador (no publicado)
  | 'published' // Publicado y visible
  | 'rented'    // Alquilado (no disponible)
  | 'archived'  // Archivado manualmente
  | 'expired';  // Expirado automáticamente

// Tipo de anuncio
export type AdType = 'standard' | 'featured';

// Estado de promoción
export type PromotionStatus = 'active' | 'inactive' | 'expired';

// Visibilidad del anuncio
export type Visibility = 'public' | 'private' | 'unlisted';

// Características de una propiedad
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
  [key: string]: boolean | undefined; // Para características adicionales
}

// Imagen de la propiedad
export interface PropertyImage {
  url: string;
  public_id: string; // ID de Cloudinary
  alt?: string;
}

// Anuncio de propiedad completo
export interface Property {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  price: number | null;
  currency: string;
  property_type: PropertyType | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqm: number | null;
  features: PropertyFeatures | null;
  images: PropertyImage[];
  virtual_tour_url: string | null;
  status: PropertyStatus;
  availability_date: string | null;
  is_featured: boolean;
  featured_until: string | null;
  ad_type: AdType;
  views_count: number;
  contact_clicks: number;
  listing_created_at: string;
  listing_expires_at: string | null;
  promotion_status: PromotionStatus;
  visibility: Visibility;
  created_at: string;
  updated_at: string;
}

// DTO para crear un anuncio
export interface CreatePropertyDto {
  title: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  price?: number;
  currency?: string;
  property_type?: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  features?: PropertyFeatures;
  images?: PropertyImage[];
  virtual_tour_url?: string;
  availability_date?: string;
  visibility?: Visibility;
}

// DTO para actualizar un anuncio
export interface UpdatePropertyDto extends Partial<CreatePropertyDto> {
  status?: PropertyStatus;
}

// DTO para marcar un anuncio como destacado
export interface FeaturePropertyDto {
  property_id: string;
  featured_until?: string; // Si no se proporciona, se calcula en base al plan
}

// Filtros para búsqueda de propiedades
export interface PropertyFilters {
  min_price?: number;
  max_price?: number;
  property_type?: PropertyType;
  bedrooms_min?: number;
  bathrooms_min?: number;
  area_min?: number;
  area_max?: number;
  city?: string;
  country?: string;
  features?: string[]; // Lista de características requeridas
  is_featured?: boolean;
  sort_by?: 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc';
  page?: number;
  limit?: number;
}
