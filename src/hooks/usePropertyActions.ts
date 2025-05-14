
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Property } from '@/types/property.types';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export function usePropertyActions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const saveProperty = async (propertyId: string) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión para guardar propiedades',
        variant: 'destructive',
      });
      navigate('/login');
      return false;
    }

    try {
      setLoading(true);
      // Mock the API call
      await new Promise(resolve => setTimeout(resolve, 500));

      toast({
        title: 'Éxito',
        description: 'Propiedad guardada correctamente',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar la propiedad',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unsaveProperty = async (propertyId: string) => {
    if (!user) return false;

    try {
      setLoading(true);
      // Mock the API call
      await new Promise(resolve => setTimeout(resolve, 500));

      toast({
        title: 'Éxito',
        description: 'Propiedad eliminada de favoritos',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la propiedad de favoritos',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const contactOwner = async (property: Property) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión para contactar al propietario',
        variant: 'destructive',
      });
      navigate('/login');
      return false;
    }

    try {
      setLoading(true);
      // Mock the API call
      await new Promise(resolve => setTimeout(resolve, 500));

      toast({
        title: 'Éxito',
        description: 'Mensaje enviado al propietario',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo enviar el mensaje',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reportProperty = async (propertyId: string, reason: string) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión para reportar una propiedad',
        variant: 'destructive',
      });
      navigate('/login');
      return false;
    }

    try {
      setLoading(true);
      // Mock the API call
      await new Promise(resolve => setTimeout(resolve, 500));

      toast({
        title: 'Éxito',
        description: 'Reporte enviado correctamente',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo enviar el reporte',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    saveProperty,
    unsaveProperty,
    contactOwner,
    reportProperty,
  };
}
