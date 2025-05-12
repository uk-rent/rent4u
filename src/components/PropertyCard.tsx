import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState } from "react";

export interface Property {
  id: string;
  title: string;
  location: string;
  postcode: string;
  price: number;
  image?: string;
  propertyType?: string;
  beds?: number;
  baths?: number;
  available: "now" | string;
  featured?: boolean;
  isFavorite?: boolean;
}

export interface PropertyCardProps {
  property: Property;
  onFavoriteToggle: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onFavoriteToggle,
  onViewDetails 
}) => {
  const [imageError, setImageError] = useState(false);

  const handleViewDetails = () => {
    onViewDetails?.(property.id);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group">
      <div className="relative">
        <div className="bg-gray-200 h-48 relative overflow-hidden">
          {property.image && !imageError ? (
            <img 
              src={property.image} 
              alt={property.title} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
            </div>
          )}
        </div>
        
        {property.featured && (
          <Badge className="absolute top-2 left-2 bg-primary hover:bg-primary text-white">
            Featured
          </Badge>
        )}
        
        <button
          className={`absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition-colors ${
            property.isFavorite ? 'text-red-500' : 'text-gray-400'
          }`}
          onClick={(e) => {
            e.preventDefault();
            onFavoriteToggle(property.id);
          }}
          aria-label={property.isFavorite ? "Remove from favorites" : "Add to favorites"}
          type="button"
        >
          <Heart 
            className={`h-5 w-5 transition-colors ${property.isFavorite ? 'fill-current' : ''}`}
            aria-hidden="true"
          />
        </button>
        
        <div className="absolute bottom-0 right-0 bg-primary text-white px-3 py-1 font-bold">
          £{property.price.toLocaleString('en-GB')}/mo
        </div>
      </div>
      
      <CardContent className="pt-4">
        <h3 className="font-bold text-lg mb-1 text-secondary line-clamp-1" title={property.title}>
          {property.title}
        </h3>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-1 flex-shrink-0" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
          <span className="line-clamp-1" title={`${property.location}, London ${property.postcode}`}>
            {property.location}, London {property.postcode}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {property.propertyType && (
            <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
              {property.propertyType}
            </Badge>
          )}
          
          {property.beds !== undefined && (
            <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
              {property.beds} {property.beds === 1 ? 'Bedroom' : property.beds === 0 ? 'Studio' : 'Bedrooms'}
            </Badge>
          )}
          
          {property.baths && (
            <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
              {property.baths} {property.baths > 1 ? 'Bathrooms' : 'Bathroom'}
            </Badge>
          )}
        </div>
        
        <div className="text-sm font-medium">
          {property.available === "now" ? (
            <span className="text-green-600">Available Now</span>
          ) : (
            <span className="text-primary">Available from {property.available}</span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          className="w-full bg-primary hover:bg-primary-hover text-white transition-colors"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;