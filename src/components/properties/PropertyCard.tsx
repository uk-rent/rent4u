
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Bed, Bath, SquareFootage } from 'lucide-react';
import { Property } from '@/types/property.types';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  saved?: boolean;
  onSaveToggle?: (propertyId: string, saved: boolean) => void;
  className?: string;
  showActions?: boolean;
}

export function PropertyCard({ 
  property, 
  saved = false, 
  onSaveToggle, 
  className,
  showActions = true 
}: PropertyCardProps) {
  // Manejar clic en guardar propiedad
  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSaveToggle) {
      onSaveToggle(property.id, !saved);
    }
  };

  // Obtener imagen principal o placeholder
  const mainImage = property.images && property.images.length > 0
    ? property.images[0].url
    : '/placeholder.svg';

  // Formatear precio
  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className={cn("overflow-hidden transition-shadow hover:shadow-md", className)}>
      <Link to={`/properties/${property.id}`} className="block">
        <div className="relative">
          {/* Imagen principal */}
          <div className="aspect-[16/10] overflow-hidden bg-gray-100">
            <img 
              src={mainImage} 
              alt={property.title} 
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>

          {/* Badge de destacado */}
          {property.is_featured && (
            <Badge 
              className="absolute top-2 left-2 bg-primary text-white border-none" 
              variant="outline"
            >
              Destacado
            </Badge>
          )}

          {/* Botón de guardar */}
          {showActions && onSaveToggle && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full", 
                saved ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-gray-700"
              )}
              onClick={handleSaveClick}
            >
              <Heart className={cn("h-5 w-5", saved && "fill-current")} />
            </Button>
          )}
        </div>

        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg line-clamp-1">{property.title}</CardTitle>
            <div className="text-lg font-bold text-primary">
              {formatPrice(property.price || 0, property.currency)}
            </div>
          </div>
          <CardDescription className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-1 inline" />
            <span className="line-clamp-1">
              {[property.address, property.city, property.country].filter(Boolean).join(', ')}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="flex justify-between text-sm">
            {property.bedrooms !== undefined && (
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{property.bedrooms} {property.bedrooms === 1 ? 'Habitación' : 'Habitaciones'}</span>
              </div>
            )}
            
            {property.bathrooms !== undefined && (
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{property.bathrooms} {property.bathrooms === 1 ? 'Baño' : 'Baños'}</span>
              </div>
            )}
            
            {property.area_sqm !== undefined && (
              <div className="flex items-center">
                <SquareFootage className="h-4 w-4 mr-1" />
                <span>{property.area_sqm} m²</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <Button variant="outline" className="w-full" asChild>
            <span>Ver detalles</span>
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
