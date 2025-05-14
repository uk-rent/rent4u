
import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/ui/dashboard-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart } from 'lucide-react';
import { Property } from '@/types/property.types';
import { getSavedProperties, toggleSavedProperty } from '@/lib/property.service';
import PropertyCard from '@/components/properties/PropertyCard';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

export default function SavedPropertiesPage() {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('grid');

  useEffect(() => {
    const loadSavedProperties = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // Call with just userId - the function has default for other parameters
        const result = await getSavedProperties(user.id);
        setSavedProperties(result.data);
        setSavedIds(result.savedIds);
      } catch (error) {
        console.error('Error loading saved properties:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar las propiedades guardadas',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadSavedProperties();
  }, [user]);

  const handleUnsaveProperty = async (propertyId: string) => {
    if (!user) return;
    
    try {
      await toggleSavedProperty(user.id, propertyId, false);
      setSavedProperties(prev => prev.filter(p => p.id !== propertyId));
      setSavedIds(prev => prev.filter(id => id !== propertyId));
      
      toast({
        title: 'Propiedad eliminada',
        description: 'La propiedad ha sido eliminada de tus favoritos',
      });
    } catch (error) {
      console.error('Error removing saved property:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la propiedad de tus favoritos',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Propiedades guardadas</h1>
            <p className="text-muted-foreground">
              Gestiona tus propiedades favoritas
            </p>
          </div>

          <Tabs value={activeView} onValueChange={setActiveView} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">Lista</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div className="grid place-items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : savedProperties.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Heart className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No tienes propiedades guardadas</h3>
              <p className="text-gray-500 mb-4">
                Cuando encuentres propiedades que te gusten, guárdalas aquí para revisarlas más tarde.
              </p>
              <Button asChild>
                <a href="/properties">Explorar propiedades</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <TabsContent value={activeView} className="mt-0">
            <div className={activeView === 'grid' ? 
              'grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 
              'space-y-4'
            }>
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
          </TabsContent>
        )}
      </div>
    </DashboardShell>
  );
}
