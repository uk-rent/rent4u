
import { useState, useEffect, useCallback } from 'react';
import { Property, PropertyFilterOptions, PropertyStats } from '@/types/property.types';
import { toast } from '@/components/ui/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { getProperties } from '@/lib/property.service';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<PropertyStats | null>(null);
  const [filters, setFilters] = useState<PropertyFilterOptions>({});
  const debouncedFilters = useDebounce(filters, 500);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getProperties({
        search: debouncedFilters.search,
        propertyType: debouncedFilters.type?.[0],
        minPrice: debouncedFilters.minPrice,
        maxPrice: debouncedFilters.maxPrice,
        beds: debouncedFilters.features?.bedrooms,
        baths: debouncedFilters.features?.bathrooms,
        featured: false,
        limit: debouncedFilters.limit || 10,
        page: debouncedFilters.page || 1
      });

      setProperties(response.data);
    } catch (error) {
      setError('Failed to fetch properties');
      toast({
        title: 'Error',
        description: 'Failed to fetch properties',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters]);

  const fetchStats = useCallback(async () => {
    try {
      // Mock stats
      const mockStats: PropertyStats = {
        totalProperties: 150,
        availableProperties: 98,
        rentedProperties: 52,
        averagePrice: 1250,
        averageRating: 4.2,
        propertyTypes: [
          { type: 'apartment', count: 75 },
          { type: 'house', count: 45 },
          { type: 'room', count: 15 },
          { type: 'studio', count: 10 },
          { type: 'commercial', count: 5 }
        ],
        locations: [
          { city: 'London', count: 50 },
          { city: 'Manchester', count: 30 },
          { city: 'Birmingham', count: 25 },
          { city: 'Liverpool', count: 20 },
          { city: 'Leeds', count: 15 },
          { city: 'Other', count: 10 }
        ]
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching property stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const updateFilters = useCallback((newFilters: PropertyFilterOptions) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    properties,
    loading,
    error,
    stats,
    filters,
    updateFilters,
    resetFilters,
    refetch: fetchProperties,
  };
}
