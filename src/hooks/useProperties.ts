import { useState, useEffect, useCallback } from 'react';
import { Property, PropertyFilterOptions, PropertyStats } from '@/types/property.types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { useDebounce } from '@/hooks/useDebounce';

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

      let query = supabase
        .from('properties')
        .select(`
          *,
          owner:profiles!properties_owner_id_fkey(*),
          images:property_images(*),
          amenities:property_amenities(*)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (debouncedFilters.type?.length) {
        query = query.in('type', debouncedFilters.type);
      }
      if (debouncedFilters.status?.length) {
        query = query.in('status', debouncedFilters.status);
      }
      if (debouncedFilters.listingType?.length) {
        query = query.in('listing_type', debouncedFilters.listingType);
      }
      if (debouncedFilters.minPrice) {
        query = query.gte('price', debouncedFilters.minPrice);
      }
      if (debouncedFilters.maxPrice) {
        query = query.lte('price', debouncedFilters.maxPrice);
      }
      if (debouncedFilters.location?.city) {
        query = query.ilike('location->city', `%${debouncedFilters.location.city}%`);
      }
      if (debouncedFilters.location?.state) {
        query = query.ilike('location->state', `%${debouncedFilters.location.state}%`);
      }
      if (debouncedFilters.location?.country) {
        query = query.ilike('location->country', `%${debouncedFilters.location.country}%`);
      }
      if (debouncedFilters.features?.bedrooms) {
        query = query.gte('features->bedrooms', debouncedFilters.features.bedrooms);
      }
      if (debouncedFilters.features?.bathrooms) {
        query = query.gte('features->bathrooms', debouncedFilters.features.bathrooms);
      }
      if (debouncedFilters.features?.minArea) {
        query = query.gte('features->area_sqm', debouncedFilters.features.minArea);
      }
      if (debouncedFilters.features?.maxArea) {
        query = query.lte('features->area_sqm', debouncedFilters.features.maxArea);
      }
      if (debouncedFilters.features?.furnished !== undefined) {
        query = query.eq('features->furnished', debouncedFilters.features.furnished);
      }
      if (debouncedFilters.features?.petsAllowed !== undefined) {
        query = query.eq('features->petsAllowed', debouncedFilters.features.petsAllowed);
      }
      if (debouncedFilters.amenities?.length) {
        query = query.contains('amenities', debouncedFilters.amenities);
      }

      // Apply sorting
      if (debouncedFilters.sortBy) {
        query = query.order(debouncedFilters.sortBy, {
          ascending: debouncedFilters.sortOrder === 'asc',
        });
      }

      // Apply pagination
      if (debouncedFilters.page && debouncedFilters.limit) {
        const from = (debouncedFilters.page - 1) * debouncedFilters.limit;
        const to = from + debouncedFilters.limit - 1;
        query = query.range(from, to);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProperties(data || []);
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
      const { data, error } = await supabase.rpc('get_property_stats');

      if (error) throw error;
      setStats(data);
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