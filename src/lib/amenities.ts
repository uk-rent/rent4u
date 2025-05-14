
// Mock amenities data for use in PropertyFilter component
export const propertyAmenities = [
  { id: '1', name: 'Wi-Fi', category: 'Technology' },
  { id: '2', name: 'Air Conditioning', category: 'Comfort' },
  { id: '3', name: 'Heating', category: 'Comfort' },
  { id: '4', name: 'Washer', category: 'Appliances' },
  { id: '5', name: 'Dryer', category: 'Appliances' },
  { id: '6', name: 'Dishwasher', category: 'Appliances' },
  { id: '7', name: 'Free Parking', category: 'Facilities' },
  { id: '8', name: 'Swimming Pool', category: 'Recreation' },
  { id: '9', name: 'Gym', category: 'Recreation' },
  { id: '10', name: 'Elevator', category: 'Facilities' },
  { id: '11', name: 'Wheelchair Accessible', category: 'Accessibility' },
  { id: '12', name: 'Fire Alarm', category: 'Safety' }
];

export const getAmenities = async () => {
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => resolve(propertyAmenities), 300);
  });
};

export const getAmenitiesByCategory = () => {
  return propertyAmenities.reduce((acc, amenity) => {
    if (!acc[amenity.category]) {
      acc[amenity.category] = [];
    }
    acc[amenity.category].push(amenity);
    return acc;
  }, {} as Record<string, typeof propertyAmenities>);
};
