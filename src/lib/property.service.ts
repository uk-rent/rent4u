
import { Property, PropertyType } from '@/types/property.types';
import { supabase } from '@/integrations/supabase/client';
import { mapDbPropertyToProperty } from '@/utils/property.mapper';

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

// Add getSavedProperties function
export const getSavedProperties = async (userId: string, options = { limit: 10, page: 1 }) => {
  try {
    const { data, error } = await supabase
      .from('saved_properties')
      .select('property_id')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    // Extract just the property IDs
    const savedIds = data.map(item => item.property_id);
    
    // Get the full property details for each saved property
    if (savedIds.length > 0) {
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .in('id', savedIds);
        
      if (propertiesError) throw propertiesError;
      
      // Map database properties to the Property type
      const properties = (propertiesData || []).map(dbProperty => mapDbPropertyToProperty(dbProperty));
      
      return { data: properties, savedIds };
    }
    
    return { data: [], savedIds: [] };
  } catch (error) {
    console.error('Error fetching saved properties:', error);
    throw error;
  }
};

// Add function to toggle saved property
export const toggleSavedProperty = async (userId: string, propertyId: string, isSaved: boolean) => {
  try {
    if (isSaved) {
      // Add to saved properties
      const { error } = await supabase
        .from('saved_properties')
        .insert({ user_id: userId, property_id: propertyId });
      
      if (error) throw error;
      return { success: true, saved: true };
    } else {
      // Remove from saved properties
      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .match({ user_id: userId, property_id: propertyId });
      
      if (error) throw error;
      return { success: true, saved: false };
    }
  } catch (error) {
    console.error('Error toggling saved property:', error);
    throw error;
  }
};
