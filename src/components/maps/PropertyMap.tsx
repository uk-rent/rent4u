
import React from 'react';
import { Card } from '@/components/ui/card';

interface PropertyMapProps {
  latitude?: number | null;
  longitude?: number | null;
  address: string;
  height?: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ 
  latitude, 
  longitude, 
  address,
  height = "300px" 
}) => {
  // Mock implementation since we can't integrate actual maps yet
  
  if (!latitude || !longitude) {
    return (
      <Card className="flex items-center justify-center bg-gray-100 text-gray-500 p-4" style={{ height }}>
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p>Location: {address}</p>
          <p className="text-xs mt-1">Map view would appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden" style={{ height }}>
      <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-600">
        <div className="text-center p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p>Location: {address}</p>
          <p className="text-xs mt-1">Coordinates: {latitude}, {longitude}</p>
        </div>
      </div>
    </Card>
  );
};

export default PropertyMap;
