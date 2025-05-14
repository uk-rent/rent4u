
export type Amenity = {
  id: string;
  name: string;
  category: AmenityCategory;
  icon?: string;
};

export type AmenityCategory = 'basic' | 'comfort' | 'security' | 'outdoor' | 'entertainment' | 'accessibility';

export const AMENITIES: Amenity[] = [
  { id: '1', name: 'Air Conditioning', category: 'comfort', icon: 'ac_unit' },
  { id: '2', name: 'Heating', category: 'comfort', icon: 'hvac' },
  { id: '3', name: 'Wi-Fi', category: 'entertainment', icon: 'wifi' },
  { id: '4', name: 'TV', category: 'entertainment', icon: 'tv' },
  { id: '5', name: 'Kitchen', category: 'basic', icon: 'kitchen' },
  { id: '6', name: 'Washer', category: 'basic', icon: 'local_laundry_service' },
  { id: '7', name: 'Dryer', category: 'basic', icon: 'local_laundry_service' },
  { id: '8', name: 'Free Parking', category: 'basic', icon: 'local_parking' },
  { id: '9', name: 'Pool', category: 'outdoor', icon: 'pool' },
  { id: '10', name: 'Hot Tub', category: 'outdoor', icon: 'hot_tub' },
  { id: '11', name: 'Gym', category: 'entertainment', icon: 'fitness_center' },
  { id: '12', name: 'Elevator', category: 'accessibility', icon: 'elevator' },
  { id: '13', name: 'Wheelchair Accessible', category: 'accessibility', icon: 'accessible' },
  { id: '14', name: 'Security Cameras', category: 'security', icon: 'videocam' },
  { id: '15', name: 'Fire Extinguisher', category: 'security', icon: 'fireplace' },
  { id: '16', name: 'Smoke Alarm', category: 'security', icon: 'detector_alarm' },
  { id: '17', name: 'Balcony', category: 'outdoor', icon: 'balcony' },
  { id: '18', name: 'Garden', category: 'outdoor', icon: 'yard' },
  { id: '19', name: 'BBQ Grill', category: 'outdoor', icon: 'outdoor_grill' },
  { id: '20', name: 'Dishwasher', category: 'basic', icon: 'dishwasher' }
];

/**
 * Fetch amenities from a mock or real data source
 */
export const getAmenities = async (): Promise<Amenity[]> => {
  return Promise.resolve(AMENITIES);
};
