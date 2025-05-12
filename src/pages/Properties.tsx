'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import PropertyCard from '@/components/PropertyCard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const initialProperties = [
  {
    id: '1',
    title: 'Modern Apartment in Central London',
    location: 'Westminster',
    postcode: 'SW1A 1AA',
    price: 2500,
    image: '/images/property-1.jpg',
    propertyType: 'Apartment',
    beds: 2,
    baths: 2,
    available: 'now',
    featured: true
  },
];

export default function PropertiesPage() {
  const [properties] = useState(initialProperties);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: 'all',  // Valor inicial cambiado
    beds: 'any',          // Valor inicial cambiado
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setIsLoading(false);
      console.log('Properties page mounted successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading properties');
      console.error('Error in PropertiesPage:', err);
    }
  }, []);

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  const handleFavoriteToggle = (propertyId: string) => {
    console.log('Toggle favorite for property:', propertyId);
  };

  const handleFilterChange = (key: string, value: string) => {
    console.log('Filter change:', key, value);
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const filteredProperties = properties.filter(property => {
    const matchesLocation = !filters.location || 
      property.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesMinPrice = !filters.minPrice || 
      property.price >= parseInt(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || 
      property.price <= parseInt(filters.maxPrice);
    const matchesPropertyType = filters.propertyType === 'all' || 
      property.propertyType === filters.propertyType;
    const matchesBeds = filters.beds === 'any' || 
      property.beds === parseInt(filters.beds);

    return matchesLocation && matchesMinPrice && matchesMaxPrice && 
           matchesPropertyType && matchesBeds;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-secondary mb-8">Available Properties</h1>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Input
            placeholder="Location"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full"
          />
          
          <Input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="w-full"
          />
          
          <Input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="w-full"
          />
          
          <Select
            value={filters.propertyType}
            onValueChange={(value) => handleFilterChange('propertyType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="House">House</SelectItem>
              <SelectItem value="Studio">Studio</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={filters.beds}
            onValueChange={(value) => handleFilterChange('beds', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="0">Studio</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Properties grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                No properties found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}