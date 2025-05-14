import { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/ui/dashboard-shell';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Property } from '@/types/property.types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getSavedProperties, toggleSavedProperty } from '@/lib/property.service';
import PropertyCard from '@/components/properties/PropertyCard'; // Fix the import
import { usePropertyActions } from '@/hooks/usePropertyActions';
import { mapDbPropertyToProperty } from '@/utils/property.mapper'; // Import the mapper function

export default function SavedPropertiesPage() {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { saveProperty, unsaveProperty } = usePropertyActions();

  useEffect(() => {
    const fetchSavedProperties = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await getSavedProperties(user.id);
        setSavedProperties(response.data);
      } catch (error) {
        console.error('Error fetching saved properties:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar las propiedades guardadas',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, [user]);

  const handleUnsaveProperty = async (propertyId: string) => {
    if (!user) return;
    
    try {
      await toggleSavedProperty(user.id, propertyId, false);
      setSavedProperties(prev => prev.filter(property => property.id !== propertyId));
      toast({
        title: 'Éxito',
        description: 'Propiedad eliminada de favoritos',
      });
    } catch (error) {
      console.error('Error unsaving property:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la propiedad de favoritos',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Propiedades guardadas</h1>
          <p className="text-gray-500">
            Aquí puedes encontrar las propiedades que has guardado.
          </p>
        </div>

        {loading ? (
          <div className="grid place-items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {savedProperties.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto mb-4 h-12 w-12 text-gray-400"
                    fill="none"
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
                  <h3 className="text-lg font-medium mb-2">No tienes propiedades guardadas</h3>
                  <p className="text-gray-500 mb-4">
                    Guarda propiedades para revisarlas más tarde.
                  </p>
                  <a
                    href="/properties"
                    className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                  >
                    Explorar propiedades
                  </a>
                </div>
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
                    onFavoriteToggle={() => handleUnsaveProperty(property.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardShell>
  );
}
