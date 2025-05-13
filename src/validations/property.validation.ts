import { z } from 'zod';
import { PROPERTY_VALIDATION } from '@/constants/property.constants';

export const propertySchema = z.object({
  title: z.string()
    .min(PROPERTY_VALIDATION.TITLE_MIN_LENGTH, `El título debe tener al menos ${PROPERTY_VALIDATION.TITLE_MIN_LENGTH} caracteres`)
    .max(PROPERTY_VALIDATION.TITLE_MAX_LENGTH, `El título no puede tener más de ${PROPERTY_VALIDATION.TITLE_MAX_LENGTH} caracteres`),
  
  description: z.string()
    .min(PROPERTY_VALIDATION.DESCRIPTION_MIN_LENGTH, `La descripción debe tener al menos ${PROPERTY_VALIDATION.DESCRIPTION_MIN_LENGTH} caracteres`)
    .max(PROPERTY_VALIDATION.DESCRIPTION_MAX_LENGTH, `La descripción no puede tener más de ${PROPERTY_VALIDATION.DESCRIPTION_MAX_LENGTH} caracteres`),
  
  type: z.enum(['apartment', 'house', 'room', 'studio', 'commercial', 'land']),
  
  status: z.enum(['available', 'rented', 'pending', 'unavailable']),
  
  listingType: z.enum(['rent', 'sale', 'both']),
  
  price: z.number()
    .min(PROPERTY_VALIDATION.PRICE_MIN, 'El precio debe ser mayor a 0')
    .max(PROPERTY_VALIDATION.PRICE_MAX, `El precio no puede ser mayor a ${PROPERTY_VALIDATION.PRICE_MAX}`),
  
  currency: z.string().length(3),
  
  deposit: z.number().optional(),
  
  location: z.object({
    address: z.string().min(1, 'La dirección es requerida'),
    city: z.string().min(1, 'La ciudad es requerida'),
    state: z.string().min(1, 'El estado es requerido'),
    country: z.string().min(1, 'El país es requerido'),
    postalCode: z.string().optional(),
    coordinates: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }).optional(),
  }),
  
  features: z.object({
    bedrooms: z.number()
      .min(PROPERTY_VALIDATION.BEDROOMS_MIN, 'El número de habitaciones debe ser mayor o igual a 0')
      .max(PROPERTY_VALIDATION.BEDROOMS_MAX, `El número de habitaciones no puede ser mayor a ${PROPERTY_VALIDATION.BEDROOMS_MAX}`),
    
    bathrooms: z.number()
      .min(PROPERTY_VALIDATION.BATHROOMS_MIN, 'El número de baños debe ser mayor o igual a 0')
      .max(PROPERTY_VALIDATION.BATHROOMS_MAX, `El número de baños no puede ser mayor a ${PROPERTY_VALIDATION.BATHROOMS_MAX}`),
    
    area_sqm: z.number()
      .min(PROPERTY_VALIDATION.AREA_MIN, 'El área debe ser mayor a 0')
      .max(PROPERTY_VALIDATION.AREA_MAX, `El área no puede ser mayor a ${PROPERTY_VALIDATION.AREA_MAX}`),
    
    furnished: z.boolean(),
    petsAllowed: z.boolean(),
    airConditioning: z.boolean(),
    heating: z.boolean(),
    parking: z.boolean(),
    elevator: z.boolean(),
    yearBuilt: z.number().optional(),
    floor: z.number().optional(),
    totalFloors: z.number().optional(),
  }),
  
  amenities: z.array(z.string()),
  
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string(),
    isMain: z.boolean(),
    order: z.number(),
    width: z.number(),
    height: z.number(),
  })),
  
  is_featured: z.boolean(),
  
  metadata: z.record(z.any()).optional(),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

export const propertyFilterSchema = z.object({
  search: z.string().optional(),
  type: z.array(z.enum(['apartment', 'house', 'room', 'studio', 'commercial', 'land'])).optional(),
  status: z.array(z.enum(['available', 'rented', 'pending', 'unavailable'])).optional(),
  listingType: z.array(z.enum(['rent', 'sale', 'both'])).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  location: z.object({
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  features: z.object({
    bedrooms: z.number().optional(),
    bathrooms: z.number().optional(),
    minArea: z.number().optional(),
    maxArea: z.number().optional(),
    furnished: z.boolean().optional(),
    petsAllowed: z.boolean().optional(),
  }).optional(),
  amenities: z.array(z.string()).optional(),
  sortBy: z.enum(['price', 'date', 'rating']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type PropertyFilterData = z.infer<typeof propertyFilterSchema>; 