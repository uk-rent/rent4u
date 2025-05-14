
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Property } from '@/types/property.types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { getSavedProperties } from '@/lib/property.service';
import { PropertyCard } from '@/components/properties/PropertyCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SavedPropertiesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    
    fetchSavedProperties();
  }, [user, page]);

  const fetchSavedProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getSavedProperties(user!.id, { page, limit: 12 });
      setProperties(result.data);
      setTotalPages(result.pages);
    } catch (err) {
      console.error('Error fetching saved properties:', err);
      setError('No se pudieron cargar las propiedades guardadas');
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las propiedades guardadas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveProperty = async (propertyId: string) => {
    try {
      await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', user!.id)
        .eq('property_id', propertyId);

      setProperties(properties.filter(p => p.id !== propertyId));
      toast({
        title: 'Éxito',
        description: 'Propiedad eliminada de favoritos',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la propiedad de favoritos',
        variant: 'destructive',
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mis Propiedades Guardadas</h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">
            <p className="mb-4">{error}</p>
            <Button onClick={fetchSavedProperties}>Reintentar</Button>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold mb-4">No tienes propiedades guardadas</h2>
            <p className="mb-6 text-gray-600">Explora nuestras propiedades y guarda tus favoritas</p>
            <Button onClick={() => navigate('/properties')}>Explorar Propiedades</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(property => (
                <PropertyCard 
                  key={property.id} 
                  property={property}
                  saved={true}
                  onSaveToggle={() => handleUnsaveProperty(property.id)}
                />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    Anterior
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={pageNum === page ? "default" : "outline"}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SavedPropertiesPage;
