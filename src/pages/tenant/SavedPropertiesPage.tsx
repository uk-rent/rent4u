import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import PropertyCard from "@/components/PropertyCard";

interface SavedProperty {
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
  isFavorite: boolean;
}

export default function SavedPropertiesPage() {
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulamos carga de propiedades guardadas
    // TODO: Reemplazar con llamada real a la API
    setTimeout(() => {
      setSavedProperties([
        {
          id: '1',
          title: 'Modern Apartment in Central London',
          location: 'Westminster',
          postcode: 'SW1A 1AA',
          price: 2500,
          image: '/images/property-1.jpg',
          propertyType: 'Apartment',
          beds: 2,
          baths: 2,
          available: 'now',
          isFavorite: true
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleFavoriteToggle = (propertyId: string) => {
    setSavedProperties(prev => 
      prev.filter(property => property.id !== propertyId)
    );
  };

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-secondary mb-8">
          Saved Properties
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : savedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                {...property}
                onFavoriteToggle={() => handleFavoriteToggle(property.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              You haven't saved any properties yet.
            </p>
            <a 
              href="/properties" 
              className="text-primary hover:text-primary-dark underline"
            >
              Browse available properties
            </a>
          </div>
        )}
      </div>
    </Layout>
  );
}