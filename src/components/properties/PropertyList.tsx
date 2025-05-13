import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property, PropertyFilter } from '@/types/property.types';
import { PropertyCard } from './PropertyCard';
import { PropertyFilter as Filter } from './PropertyFilter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GridIcon, ListIcon, SearchIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { Skeleton } from '@/components/ui/skeleton';

interface PropertyListProps {
  initialFilter?: PropertyFilter;
  showFilter?: boolean;
  limit?: number;
  savedProperties?: string[];
  onSaveToggle?: (propertyId: string, saved: boolean) => void;
  loading?: boolean;
  onFilterChange?: (filter: PropertyFilter) => void;
}

export function PropertyList({
  initialFilter,
  showFilter = true,
  limit,
  savedProperties = [],
  onSaveToggle,
  loading: externalLoading,
  onFilterChange,
}: PropertyListProps) {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PropertyFilter>(initialFilter || {});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchProperties();
  }, [filter, debouncedSearchQuery]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('properties')
        .select(`
          *,
          owner:profiles!properties_owner_id_fkey(*),
          images:property_images(*)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filter.type?.length) {
        query = query.in('type', filter.type);
      }
      if (filter.minPrice) {
        query = query.gte('price', filter.minPrice);
      }
      if (filter.maxPrice) {
        query = query.lte('price', filter.maxPrice);
      }
      if (filter.bedrooms) {
        query = query.gte('features->bedrooms', filter.bedrooms);
      }
      if (filter.bathrooms) {
        query = query.gte('features->bathrooms', filter.bathrooms);
      }
      if (filter.furnished !== undefined) {
        query = query.eq('features->furnished', filter.furnished);
      }
      if (filter.petsAllowed !== undefined) {
        query = query.eq('features->petsAllowed', filter.petsAllowed);
      }
      if (filter.location?.city) {
        query = query.ilike('location->city', `%${filter.location.city}%`);
      }
      if (filter.location?.state) {
        query = query.ilike('location->state', `%${filter.location.state}%`);
      }
      if (filter.location?.country) {
        query = query.ilike('location->country', `%${filter.location.country}%`);
      }

      // Apply search query
      if (debouncedSearchQuery) {
        query = query.or(
          `title.ilike.%${debouncedSearchQuery}%,description.ilike.%${debouncedSearchQuery}%,location->address.ilike.%${debouncedSearchQuery}%`
        );
      }

      // Apply limit if specified
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch properties',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter: PropertyFilter) => {
    setFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProperties();
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );

  const isLoading = externalLoading || loading;

  return (
    <div className="space-y-6">
      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 max-w-md"
          />
        </form>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <GridIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <ListIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar */}
        {showFilter && (
          <div className="w-full lg:w-64 flex-shrink-0">
            <Filter
              initialFilter={filter}
              onFilterChange={handleFilterChange}
            />
          </div>
        )}

        {/* Property Grid/List */}
        <div className="flex-1">
          {isLoading ? (
            renderSkeleton()
          ) : properties.length > 0 ? (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  viewMode={viewMode}
                  isSaved={savedProperties.includes(property.id)}
                  onSaveToggle={onSaveToggle}
                  onClick={() => navigate(`/properties/${property.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">
                No properties found
              </h3>
              <p className="mt-2 text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 