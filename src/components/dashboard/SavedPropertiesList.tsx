
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PropertyCard from '@/components/properties/PropertyCard';
import { Property } from '@/types/property.types';

interface SavedPropertiesListProps {
  savedProperties: Property[];
  onFavoriteToggle: (id: string) => void;
}

export function SavedPropertiesList({ savedProperties, onFavoriteToggle }: SavedPropertiesListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Propiedades guardadas</h2>
        <Button variant="link" asChild>
          <Link to="/dashboard/saved">
            Ver todas <Heart className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {savedProperties.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Heart className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No tienes propiedades guardadas</h3>
            <p className="text-gray-500 mb-4">
              Guarda propiedades para revisarlas más tarde.
            </p>
            <Button asChild>
              <Link to="/properties">Explorar propiedades</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {savedProperties.map((property) => (
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
              isFavorite={true}
              onFavoriteToggle={onFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
