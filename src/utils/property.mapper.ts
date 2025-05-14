
import { Json } from '@/integrations/supabase/types';
import { Property, PropertyImage, PropertyLocation, PropertyFeatures, PropertyAmenity } from '@/types/property.types';

/**
 * Maps a Supabase property database record to our application's Property type
 */
export function mapDbPropertyToProperty(dbProperty: any): Property {
  // Handle images conversion from Json to PropertyImage[]
  const images: PropertyImage[] = Array.isArray(dbProperty.images) 
    ? dbProperty.images 
    : dbProperty.images ? (dbProperty.images as any as PropertyImage[]) : [];

  // Handle amenities conversion
  const amenities: PropertyAmenity[] = Array.isArray(dbProperty.amenities) 
    ? dbProperty.amenities 
    : dbProperty.amenities ? (dbProperty.amenities as any as PropertyAmenity[]) : [];

  // Extract location data
  const location: PropertyLocation = {
    address: dbProperty.address || '',
    city: dbProperty.city || '',
    state: dbProperty.state || '',
    country: dbProperty.country || '',
    postalCode: dbProperty.postcode || '',
    coordinates: dbProperty.latitude && dbProperty.longitude 
      ? { latitude: dbProperty.latitude, longitude: dbProperty.longitude } 
      : undefined
  };

  // Map features from the database
  const features: PropertyFeatures = {
    bedrooms: dbProperty.beds || 0,
    bathrooms: dbProperty.baths || 0,
    area_sqm: parseFloat(dbProperty.area) || 0,
    furnished: dbProperty.features?.furnished || false,
    petsAllowed: dbProperty.features?.petsAllowed || false,
    airConditioning: dbProperty.features?.airConditioning || false,
    heating: dbProperty.features?.heating || false,
    parking: dbProperty.features?.parking || false,
    elevator: dbProperty.features?.elevator || false,
    yearBuilt: dbProperty.features?.yearBuilt,
    floor: dbProperty.features?.floor,
    totalFloors: dbProperty.features?.totalFloors
  };

  return {
    id: dbProperty.id,
    title: dbProperty.title || dbProperty.address || '',
    description: dbProperty.description || '',
    type: dbProperty.propertyType || 'apartment',
    status: dbProperty.status || 'available',
    listingType: dbProperty.listing_type || 'rent',
    price: dbProperty.price || 0,
    currency: dbProperty.currency || 'USD',
    deposit: dbProperty.deposit,
    location,
    features,
    amenities,
    images,
    ownerId: dbProperty.owner_id || '',
    owner: dbProperty.owner,
    rating: dbProperty.rating,
    reviewCount: dbProperty.review_count,
    is_featured: dbProperty.is_featured || false,
    createdAt: dbProperty.created_at,
    updatedAt: dbProperty.updated_at,
    publishedAt: dbProperty.published_at,
    metadata: dbProperty.metadata
  };
}

/**
 * Maps an application Property to a format suitable for Supabase database insertion
 */
export function mapPropertyToDbProperty(property: Partial<Property>): any {
  // Format images for DB if they exist
  const images = property.images ? JSON.stringify(property.images) : null;
  
  // Format amenities for DB if they exist
  const amenities = property.amenities ? JSON.stringify(property.amenities) : null;
  
  // Extract location data
  const location = property.location;
  
  return {
    title: property.title,
    description: property.description,
    property_type: property.type,
    status: property.status,
    listing_type: property.listingType,
    price: property.price,
    currency: property.currency,
    deposit: property.deposit,
    address: location?.address,
    city: location?.city,
    state: location?.state,
    country: location?.country,
    postcode: location?.postalCode,
    latitude: location?.coordinates?.latitude,
    longitude: location?.coordinates?.longitude,
    beds: property.features?.bedrooms,
    baths: property.features?.bathrooms,
    area: property.features?.area_sqm?.toString(),
    features: JSON.stringify(property.features),
    images,
    amenities,
    owner_id: property.ownerId,
    is_featured: property.is_featured,
    metadata: property.metadata ? JSON.stringify(property.metadata) : null
  };
}
