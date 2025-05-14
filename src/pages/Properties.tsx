
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { PropertyList } from "../components/properties/PropertyList";
import { PropertyFilter } from "../components/properties/PropertyFilter";
import { PropertyStats } from "../components/properties/PropertyStats";
import { usePropertyContext } from "../contexts/PropertyContext";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../integrations/supabase/client";
import { toast } from "../components/ui/use-toast";
import { PropertyFilterOptions } from "../types/property.types";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { usePropertyActions } from "../hooks/usePropertyActions";

const PropertiesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    properties,
    loading,
    error,
    filters,
    updateFilters,
    refetch
  } = usePropertyContext();

  const { saveProperty, unsaveProperty } = usePropertyActions();
  const [savedProperties, setSavedProperties] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchSavedProperties();
    } else {
      setSavedProperties([]);
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchSavedProperties = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('saved_properties')
        .select('property_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setSavedProperties(data.map(item => item.property_id));
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las propiedades guardadas",
        variant: "destructive",
      });
    }
  };

  const handleSaveToggle = async (propertyId: string, saved: boolean) => {
    if (!user) {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para guardar propiedades",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    try {
      if (saved) {
        await saveProperty(propertyId);
        setSavedProperties(prev => [...prev, propertyId]);
      } else {
        await unsaveProperty(propertyId);
        setSavedProperties(prev => prev.filter(id => id !== propertyId));
      }
    } catch {
      toast({
        title: "Error",
        description: "No se pudo actualizar la propiedad guardada",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = useCallback((newFilters: PropertyFilterOptions) => {
    updateFilters(newFilters);
  }, [updateFilters]);

  const handlePublishProperty = () => {
    if (!user) {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para publicar una propiedad",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    navigate('/publish-property');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-alternate">
        <div className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">Encuentra tu Propiedad Ideal</h1>
              <p className="text-xl max-w-2xl">
                Explora nuestra extensa colección de propiedades en alquiler y venta
              </p>
            </div>
            {user && (
              <Button
                onClick={handlePublishProperty}
                className="bg-white text-primary hover:bg-gray-100"
              >
                <Plus className="h-4 w-4 mr-2" />
                Publicar Propiedad
              </Button>
            )}
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 flex-shrink-0">
            <PropertyFilter
              initialFilters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
          <div className="flex-1">
            <PropertyList
              properties={properties}
              loading={loading}
              savedProperties={savedProperties}
              onSaveToggle={handleSaveToggle}
              onFilterChange={handleFilterChange}
            />
            {error && (
              <div className="text-center text-red-600 mt-4">
                {error}
                <Button onClick={refetch} className="ml-4">Reintentar</Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertiesPage;
