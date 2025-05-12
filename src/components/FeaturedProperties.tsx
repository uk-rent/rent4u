
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { propertyData } from "@/data/properties";

const PropertyCard = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = (e) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  return (
    <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <div className="relative">
        <div className="bg-gray-200 h-48 relative">
          {property.image ? (
            <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
          onClick={toggleFavorite}
        >
          {isFavorite ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>
        
        <div className="absolute bottom-0 right-0 bg-primary text-white px-3 py-1 font-bold">
          £{property.price}/mo
        </div>
      </div>
      
      <CardContent className="pt-4">
        <h3 className="font-bold text-lg mb-1 text-secondary">{property.title}</h3>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{property.location}, London {property.postcode}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {property.propertyType && (
            <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
              {property.propertyType}
            </Badge>
          )}
          
          {property.beds && (
            <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
              {property.beds} {property.beds > 1 ? 'Bedrooms' : 'Bedroom'}
            </Badge>
          )}
          
          {property.baths && (
            <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
              {property.baths} {property.baths > 1 ? 'Bathrooms' : 'Bathroom'}
            </Badge>
          )}
        </div>
        
        <div className="text-sm font-medium text-primary">
          {property.available === "now" ? (
            <span>Available Now</span>
          ) : (
            <span>From {property.available}</span>
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

const FeaturedProperties = () => {
  return (
    <section className="py-16 bg-alternate">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-secondary">Featured Properties</h2>
            <p className="text-gray-600 mt-2">
              Discover our hand-picked selection of the finest rental properties across London
            </p>
          </div>
          
          <Button variant="outline" className="hidden md:flex">
            View All Properties
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propertyData.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        
        <div className="mt-8 flex justify-center md:hidden">
          <Button variant="outline">
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
