
// Tipo de propiedad
export type PropertyType = 'apartment' | 'house' | 'room' | 'studio' | 'commercial' | 'land';

// Estado de disponibilidad de la propiedad
export type PropertyStatus = 'available' | 'rented' | 'pending' | 'unavailable';

// Tipo de anuncio
export type AdType = 'standard' | 'featured';

// Estado de promoción
export type PromotionStatus = 'active' | 'inactive' | 'expired';

// Visibilidad del anuncio
export type Visibility = 'public' | 'private' | 'unlisted';

// Tipo de listado de propiedad
export type PropertyListingType = 'rent' | 'sale' | 'both';

// Características de una propiedad
export interface PropertyFeatures {
  bedrooms: number;
  bathrooms: number;
  area_sqm: number;
  furnished: boolean;
  petsAllowed: boolean;
  airConditioning: boolean;
  heating: boolean;
  parking: boolean;
  elevator: boolean;
  yearBuilt?: number;
  floor?: number;
  totalFloors?: number;
}

// Imagen de la propiedad
export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  isMain: boolean;
  order: number;
  width: number;
  height: number;
}

// Anuncio de propiedad completo
export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  listingType: PropertyListingType;
  price: number;
  currency: string;
  deposit?: number;
  location: PropertyLocation;
  features: PropertyFeatures;
  images: PropertyImage[];
  amenities: PropertyAmenity[];
  ownerId: string;
  owner?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  rating?: number;
  reviewCount?: number;
  is_featured: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  metadata?: Record<string, any>;
  
  // These fields are needed for backwards compatibility with existing components
  address?: string;
  city?: string;
  country?: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  property_type?: string;
  latitude?: number | null;
  longitude?: number | null;
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

// Tipos adicionales para los nuevos componentes
export interface PropertyFilterOptions {
  search?: string;
  type?: PropertyType[];
  status?: PropertyStatus[];
  listingType?: PropertyListingType[];
  minPrice?: number;
  maxPrice?: number;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  features?: {
    bedrooms?: number;
    bathrooms?: number;
    minArea?: number;
    maxArea?: number;
    furnished?: boolean;
    petsAllowed?: boolean;
  };
  amenities?: string[];
  sortBy?: 'price' | 'date' | 'rating';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PropertySearchParams extends PropertyFilterOptions {
  query?: string;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface PropertyBooking {
  id: string;
  propertyId: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PropertyAmenity {
  id: string;
  name: string;
  category: string;
  icon?: string;
}

export interface PropertyStats {
  totalProperties: number;
  availableProperties: number;
  rentedProperties: number;
  averagePrice: number;
  averageRating: number;
  propertyTypes: {
    type: PropertyType;
    count: number;
  }[];
  locations: {
    city: string;
    count: number;
  }[];
}
