import { Property, PropertyType, PropertyStatus, PropertyListingType } from '@/types/property.types';
import { PROPERTY_TYPES, PROPERTY_STATUS, PROPERTY_LISTING_TYPES } from '@/constants/property.constants';

export const formatPropertyType = (type: PropertyType): string => {
  const typeMap: Record<PropertyType, string> = {
    [PROPERTY_TYPES.APARTMENT]: 'Apartamento',
    [PROPERTY_TYPES.HOUSE]: 'Casa',
    [PROPERTY_TYPES.ROOM]: 'Habitación',
    [PROPERTY_TYPES.STUDIO]: 'Estudio',
    [PROPERTY_TYPES.COMMERCIAL]: 'Comercial',
    [PROPERTY_TYPES.LAND]: 'Terreno',
  };
  return typeMap[type] || type;
};

export const formatPropertyStatus = (status: PropertyStatus): string => {
  const statusMap: Record<PropertyStatus, string> = {
    [PROPERTY_STATUS.AVAILABLE]: 'Disponible',
    [PROPERTY_STATUS.RENTED]: 'Alquilado',
    [PROPERTY_STATUS.PENDING]: 'Pendiente',
    [PROPERTY_STATUS.UNAVAILABLE]: 'No disponible',
  };
  return statusMap[status] || status;
};

export const formatListingType = (type: PropertyListingType): string => {
  const typeMap: Record<PropertyListingType, string> = {
    [PROPERTY_LISTING_TYPES.RENT]: 'Alquiler',
    [PROPERTY_LISTING_TYPES.SALE]: 'Venta',
    [PROPERTY_LISTING_TYPES.BOTH]: 'Alquiler/Venta',
  };
  return typeMap[type] || type;
};

export const calculatePropertyScore = (property: Property): number => {
  let score = 0;

  // Base score for property type
  const typeScores: Record<PropertyType, number> = {
    [PROPERTY_TYPES.APARTMENT]: 1,
    [PROPERTY_TYPES.HOUSE]: 1.2,
    [PROPERTY_TYPES.ROOM]: 0.8,
    [PROPERTY_TYPES.STUDIO]: 0.9,
    [PROPERTY_TYPES.COMMERCIAL]: 1.1,
    [PROPERTY_TYPES.LAND]: 0.7,
  };
  score += typeScores[property.type] || 1;

  // Score for features
  if (property.features.furnished) score += 0.2;
  if (property.features.petsAllowed) score += 0.1;
  if (property.features.airConditioning) score += 0.15;
  if (property.features.heating) score += 0.15;
  if (property.features.parking) score += 0.2;
  if (property.features.elevator) score += 0.1;

  // Score for amenities
  score += property.amenities.length * 0.05;

  // Score for images
  score += Math.min(property.images.length * 0.1, 0.5);

  // Score for rating
  if (property.rating) {
    score += property.rating * 0.2;
  }

  return Math.min(score, 5);
};

export const validateProperty = (property: Partial<Property>): string[] => {
  const errors: string[] = [];

  if (!property.title) {
    errors.push('El título es requerido');
  } else if (property.title.length < 10) {
    errors.push('El título debe tener al menos 10 caracteres');
  }

  if (!property.description) {
    errors.push('La descripción es requerida');
  } else if (property.description.length < 50) {
    errors.push('La descripción debe tener al menos 50 caracteres');
  }

  if (!property.price || property.price <= 0) {
    errors.push('El precio debe ser mayor a 0');
  }

  if (!property.location?.city) {
    errors.push('La ciudad es requerida');
  }

  if (!property.features?.bedrooms || property.features.bedrooms < 0) {
    errors.push('El número de habitaciones es requerido');
  }

  if (!property.features?.bathrooms || property.features.bathrooms < 0) {
    errors.push('El número de baños es requerido');
  }

  if (!property.features?.area_sqm || property.features.area_sqm <= 0) {
    errors.push('El área es requerida');
  }

  return errors;
};

export const getPropertyImageUrl = (property: Property, size: 'thumbnail' | 'medium' | 'large' = 'medium'): string => {
  const mainImage = property.images.find(img => img.isMain) || property.images[0];
  if (!mainImage) return '/placeholder.svg';

  // Aquí podrías implementar la lógica para diferentes tamaños de imagen
  return mainImage.url;
};

export const formatPropertyAddress = (property: Property): string => {
  const { address, city, state, country } = property.location;
  return [address, city, state, country].filter(Boolean).join(', ');
};

export const calculatePropertyAge = (property: Property): string => {
  const createdAt = new Date(property.createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdAt.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Publicado hoy';
  if (diffDays === 1) return 'Publicado ayer';
  if (diffDays < 7) return `Publicado hace ${diffDays} días`;
  if (diffDays < 30) return `Publicado hace ${Math.floor(diffDays / 7)} semanas`;
  if (diffDays < 365) return `Publicado hace ${Math.floor(diffDays / 30)} meses`;
  return `Publicado hace ${Math.floor(diffDays / 365)} años`;
}; 