import { Property, PropertyType } from '@/types/property.types';

// Mock function to simulate fetching properties
export const getProperties = async (params: any = {}) => {
  try {
    // Mock data or actual database call
    const mockProperties: Property[] = [
      {
        id: '1',
        title: 'Modern Apartment in Central London',
        description: 'A beautiful modern apartment in the heart of London',
        type: 'apartment',
        status: 'available',
        listingType: 'rent',
        price: 1500,
        currency: 'GBP',
        location: {
          address: '123 London Road',
          city: 'London',
          state: 'Greater London',
          country: 'UK',
          postalCode: 'EC1V 4EX',
          coordinates: {
            latitude: 51.509865,
            longitude: -0.118092
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
        amenities: [],
        images: [
          {
            id: 'img1',
            url: '/images/property-1.jpg',
            alt: 'Living room',
            isMain: true,
            order: 0,
            width: 1200,
            height: 800
          }
        ],
        ownerId: 'owner-1',
        is_featured: true,
        createdAt: '2023-01-15T12:00:00Z',
        updatedAt: '2023-01-15T12:00:00Z',
        available: 'now'
      }
    ];

    return { data: mockProperties, count: mockProperties.length };
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};
