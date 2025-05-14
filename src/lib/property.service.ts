
import { Property, PropertyType, PropertyFeatures, PropertyStats } from '@/types/property.types';
import { v4 as uuidv4 } from 'uuid';

// Mock data for properties
const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Modern Apartment in City Center',
    description: 'Beautiful modern apartment with great view',
    type: 'apartment',
    status: 'available',
    listingType: 'rent',
    price: 1200,
    currency: 'USD',
    deposit: 1200,
    location: {
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001',
      coordinates: {
        latitude: 40.7128,
        longitude: -74.006
      }
    },
    features: {
      bedrooms: 2,
      bathrooms: 1,
      area_sqm: 75,
      furnished: true,
      petsAllowed: false,
      airConditioning: true,
      heating: true,
      parking: false,
      elevator: true
    },
    images: [
      {
        id: '1',
        url: '/images/abdul-basit-rINhkSb3HLs-unsplash Medium.jpeg',
        alt: 'Living room',
        isMain: true,
        order: 1,
        width: 1200,
        height: 800
      },
      {
        id: '2',
        url: '/images/alex-tyson-2zpt6c1zGx0-unsplash Medium 6 2.jpeg',
        alt: 'Kitchen',
        isMain: false,
        order: 2,
        width: 1200,
        height: 800
      }
    ],
    amenities: [
      {
        id: '1',
        name: 'Wi-Fi',
        category: 'basic'
      },
      {
        id: '2',
        name: 'Air Conditioning',
        category: 'comfort'
      }
    ],
    ownerId: 'owner1',
    is_featured: true,
    createdAt: '2023-05-15T10:00:00Z',
    updatedAt: '2023-05-15T10:00:00Z',
    available: 'now'
  },
  {
    id: '2',
    title: 'Cozy House with Garden',
    description: 'Spacious family house with beautiful garden',
    type: 'house',
    status: 'available',
    listingType: 'rent',
    price: 2200,
    currency: 'USD',
    deposit: 2200,
    location: {
      address: '456 Oak St',
      city: 'Boston',
      state: 'MA',
      country: 'USA',
      postalCode: '02108',
      coordinates: {
        latitude: 42.3601,
        longitude: -71.0589
      }
    },
    features: {
      bedrooms: 3,
      bathrooms: 2,
      area_sqm: 120,
      furnished: false,
      petsAllowed: true,
      airConditioning: true,
      heating: true,
      parking: true,
      elevator: false
    },
    images: [
      {
        id: '3',
        url: '/images/lisa-anna-h45JG7euzFo-unsplash Large 4.jpeg',
        alt: 'House front',
        isMain: true,
        order: 1,
        width: 1200,
        height: 800
      }
    ],
    amenities: [
      {
        id: '3',
        name: 'Garden',
        category: 'outdoor'
      },
      {
        id: '4',
        name: 'Parking',
        category: 'basic'
      }
    ],
    ownerId: 'owner2',
    is_featured: false,
    createdAt: '2023-06-20T14:30:00Z',
    updatedAt: '2023-06-20T14:30:00Z',
    available: '2023-07-01'
  },
  {
    id: '3',
    title: 'Studio Apartment Near University',
    description: 'Perfect for students, close to campus',
    type: 'studio',
    status: 'available',
    listingType: 'rent',
    price: 800,
    currency: 'USD',
    deposit: 800,
    location: {
      address: '789 College Ave',
      city: 'Cambridge',
      state: 'MA',
      country: 'USA',
      postalCode: '02138',
      coordinates: {
        latitude: 42.3736,
        longitude: -71.1097
      }
    },
    features: {
      bedrooms: 0,
      bathrooms: 1,
      area_sqm: 35,
      furnished: true,
      petsAllowed: false,
      airConditioning: false,
      heating: true,
      parking: false,
      elevator: true
    },
    images: [
      {
        id: '4',
        url: '/images/misuto-kazo-CtQVcirBnCk-unsplash Medium.jpeg',
        alt: 'Studio apartment',
        isMain: true,
        order: 1,
        width: 1200,
        height: 800
      }
    ],
    amenities: [
      {
        id: '5',
        name: 'Study Desk',
        category: 'basic'
      },
      {
        id: '6',
        name: 'Laundry Room',
        category: 'basic'
      }
    ],
    ownerId: 'owner1',
    is_featured: false,
    createdAt: '2023-07-05T09:15:00Z',
    updatedAt: '2023-07-05T09:15:00Z',
    available: 'now'
  }
];

/**
 * Get properties with pagination and filters
 */
export const getProperties = async (
  params: {
    page?: number;
    limit?: number;
    search?: string;
    propertyType?: PropertyType;
    minPrice?: number;
    maxPrice?: number;
    beds?: number;
    baths?: number;
    featured?: boolean;
    userId?: string; // For getting properties of a specific user
  }
): Promise<{ data: Property[]; total: number; page: number; limit: number; pages: number }> => {
  const {
    page = 1,
    limit = 10,
    search,
    propertyType,
    minPrice,
    maxPrice,
    beds,
    baths,
    featured,
    userId
  } = params;

  // Mock API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Apply filters
  let filteredProperties = [...MOCK_PROPERTIES];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredProperties = filteredProperties.filter(property => 
      property.title.toLowerCase().includes(searchLower) || 
      property.description.toLowerCase().includes(searchLower) ||
      property.location.address.toLowerCase().includes(searchLower)
    );
  }

  if (propertyType) {
    filteredProperties = filteredProperties.filter(property => 
      property.type === propertyType
    );
  }

  if (minPrice !== undefined) {
    filteredProperties = filteredProperties.filter(property => 
      property.price >= minPrice
    );
  }

  if (maxPrice !== undefined) {
    filteredProperties = filteredProperties.filter(property => 
      property.price <= maxPrice
    );
  }

  if (beds !== undefined) {
    filteredProperties = filteredProperties.filter(property => 
      property.features.bedrooms >= beds
    );
  }

  if (baths !== undefined) {
    filteredProperties = filteredProperties.filter(property => 
      property.features.bathrooms >= baths
    );
  }

  if (featured !== undefined) {
    filteredProperties = filteredProperties.filter(property => 
      property.is_featured === featured
    );
  }

  if (userId) {
    filteredProperties = filteredProperties.filter(property => 
      property.ownerId === userId
    );
  }

  // Sort properties (featured first, then by date)
  filteredProperties.sort((a, b) => {
    if (a.is_featured !== b.is_featured) {
      return a.is_featured ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Apply pagination
  const total = filteredProperties.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProperties = filteredProperties.slice(startIndex, endIndex);
  const pages = Math.ceil(total / limit);

  return {
    data: paginatedProperties,
    total,
    page,
    limit,
    pages
  };
};
