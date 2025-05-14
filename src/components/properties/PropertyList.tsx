
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property, PropertyFilterOptions } from '@/types/property.types';
import PropertyCard from './PropertyCard';
import { PropertyFilter } from './PropertyFilter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GridIcon, ListIcon, SearchIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { Skeleton } from '@/components/ui/skeleton';
import { getProperties } from '@/lib/property.service';

interface PropertyListProps {
  initialFilter?: PropertyFilterOptions;
  showFilter?: boolean;
  limit?: number;
  savedProperties?: string[];
  onSaveToggle?: (propertyId: string, saved: boolean) => void;
  loading?: boolean;
  onFilterChange?: (filter: PropertyFilterOptions) => void;
  properties?: Property[]; // Added properties prop
}

export function PropertyList({
  initialFilter,
  showFilter = true,
  limit,
  savedProperties = [],
  onSaveToggle,
  loading: externalLoading,
  onFilterChange,
  properties: externalProperties, // Use external properties if provided
}: PropertyListProps) {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>(externalProperties || []);
  const [loading, setLoading] = useState(!externalProperties);
  const [filter, setFilter] = useState<PropertyFilterOptions>(initialFilter || {});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    // If external properties are provided, use them
    if (externalProperties) {
      setProperties(externalProperties);
      return;
    }
    
    fetchProperties();
  }, [filter, debouncedSearchQuery, externalProperties]);

  const fetchProperties = async () => {
    // Skip fetching if external properties are provided
    if (externalProperties) return;
    
    try {
      setLoading(true);

      // Use the property service instead of direct Supabase calls
      const response = await getProperties({
        search: debouncedSearchQuery,
        propertyType: filter.type?.[0],
        minPrice: filter.minPrice,
        maxPrice: filter.maxPrice,
        beds: filter.features?.bedrooms,
        baths: filter.features?.bathrooms,
        featured: false,
        limit: limit || 10,
        page: filter.page || 1
      });

      setProperties(response.data);
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

  const handleFilterChange = (newFilter: PropertyFilterOptions) => {
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
            <PropertyFilter
              initialFilters={filter}
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
                  id={property.id}
                  title={property.title}
                  location={property.location?.address || ''}
                  postcode={property.location?.postalCode || ''}
                  price={property.price}
                  image={property.images?.[0]?.url}
                  propertyType={property.type}
                  beds={property.features?.bedrooms}
                  baths={property.features?.bathrooms}
                  available={property.available || 'now'}
                  featured={property.is_featured}
                  isFavorite={savedProperties.includes(property.id)}
                  onFavoriteToggle={(id) => 
                    onSaveToggle?.(id, !savedProperties.includes(id))
                  }
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
