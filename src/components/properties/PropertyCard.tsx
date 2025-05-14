
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  postcode: string;
  price: number;
  image?: string;
  propertyType?: string;
  beds?: number;
  baths?: number;
  available: string;
  featured?: boolean;
  onFavoriteToggle: (id: string) => void;
  isFavorite?: boolean;
}

const PropertyCard = ({
  id,
  title,
  location,
  postcode,
  price,
  image,
  propertyType,
  beds,
  baths,
  available,
  featured,
  onFavoriteToggle,
  isFavorite = false,
}: PropertyCardProps) => {
  return (
    <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <div className="relative">
        <div className="bg-gray-200 h-48 relative">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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

        {featured && (
          <Badge className="absolute top-2 left-2 bg-primary hover:bg-primary text-white">
            Featured
          </Badge>
        )}

        <button
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
          onClick={() => onFavoriteToggle(id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
            fill={isFavorite ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        <div className="absolute bottom-0 right-0 bg-primary text-white px-3 py-1 font-bold">
          £{price}/mo
        </div>
      </div>

      <CardContent className="pt-4">
        <h3 className="font-bold text-lg mb-1 text-secondary">{title}</h3>

        <div className="flex items-center text-gray-500 text-sm mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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
          <span>{location} {postcode || ''}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {propertyType && (
            <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
              {propertyType}
            </Badge>
          )}

          {beds !== undefined && (
            <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
              {beds} {beds === 1 ? 'Bedroom' : beds === 0 ? 'Studio' : 'Bedrooms'}
            </Badge>
          )}

          {baths !== undefined && (
            <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
              {baths} {baths > 1 ? 'Bathrooms' : 'Bathroom'}
            </Badge>
          )}
        </div>

        <div className="text-sm font-medium text-primary">
          {available === "now" ? (
            <span>Available Now</span>
          ) : (
            <span>From {available}</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button className="w-full bg-primary hover:bg-primary-hover text-white">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
