
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { PropertySearchParams } from '@/types/property.types';

interface PropertySearchProps {
  onSearch: (params: PropertySearchParams) => void;
  initialQuery?: string;
}

export function PropertySearch({ onSearch, initialQuery = '' }: PropertySearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a proper location filter object with city property
    const locationFilter = location ? { city: location, state: undefined, country: undefined } : undefined;
    
    onSearch({
      query,
      location: location || undefined,
      locationFilter,
      page: 1
    });
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Search properties..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full"
        />
      </div>
      <Button type="submit" className="md:w-auto">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
}
