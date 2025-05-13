import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { PropertyType, PropertyFilterOptions } from '../../types/property.types';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { supabase } from '../../lib/supabase';

interface PropertyFilterProps {
  onFilterChange: (filters: PropertyFilterOptions) => void;
  initialFilters?: PropertyFilterOptions;
}

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'apartment', label: 'Apartamento' },
  { value: 'house', label: 'Casa' },
  { value: 'room', label: 'Habitación' },
  { value: 'studio', label: 'Estudio' },
  { value: 'commercial', label: 'Comercial' },
  { value: 'land', label: 'Terreno' },
];

const FEATURES = [
  { key: 'furnished', label: 'Amueblado' },
  { key: 'petsAllowed', label: 'Mascotas permitidas' },
  { key: 'airConditioning', label: 'Aire acondicionado' },
  { key: 'heating', label: 'Calefacción' },
  { key: 'parking', label: 'Estacionamiento' },
  { key: 'elevator', label: 'Ascensor' },
];

export function PropertyFilter({ onFilterChange, initialFilters }: PropertyFilterProps) {
  const [filters, setFilters] = useState<PropertyFilterOptions>(initialFilters || {});
  const [amenities, setAmenities] = useState<string[]>([]);

  useEffect(() => {
    // Fetch available amenities from the database
    const fetchAmenities = async () => {
      try {
        const { data, error } = await supabase
          .from('amenities')
          .select('name')
          .order('name');

        if (error) throw error;
        setAmenities(data.map((item) => item.name));
      } catch (error) {
        console.error('Error fetching amenities:', error);
      }
    };

    fetchAmenities();
  }, []);

  const handlePropertyTypeChange = (type: PropertyType) => {
    setFilters(prev => ({
      ...prev,
      type: prev.type?.includes(type)
        ? prev.type.filter(t => t !== type)
        : [...(prev.type || []), type]
    }));
  };

  const handleFeatureChange = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features?.[feature],
      }
    }));
  };

  const handleAmenityChange = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities?.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...(prev.amenities || []), amenity]
    }));
  };

  const handleLocationChange = (location: { city?: string; state?: string; country?: string }) => {
    setFilters(prev => ({
      ...prev,
      location: {
        ...prev.location,
        ...location
      }
    }));
  };

  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1]
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtrar Propiedades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Price Range */}
          <div className="space-y-4">
            <Label>Rango de Precio</Label>
            <Slider
              defaultValue={[filters.minPrice || 0, filters.maxPrice || 10000]}
              max={10000}
              min={0}
              step={100}
              onValueChange={handlePriceChange}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>${filters.minPrice || 0}</span>
              <span>${filters.maxPrice || 10000}</span>
            </div>
          </div>

          {/* Property Types */}
          <div className="space-y-4">
            <Label>Tipo de Propiedad</Label>
            <div className="space-y-2">
              {PROPERTY_TYPES.map(({ value, label }) => (
                <div key={value} className="flex items-center space-x-2">
                  <Checkbox
                    id={value}
                    checked={filters.type?.includes(value)}
                    onCheckedChange={() => handlePropertyTypeChange(value)}
                  />
                  <Label htmlFor={value}>{label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <Label>Características</Label>
            <div className="space-y-2">
              {FEATURES.map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={!!filters.features?.[key]}
                    onCheckedChange={() => handleFeatureChange(key)}
                  />
                  <Label htmlFor={key}>{label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <Label>Amenidades</Label>
            <div className="space-y-2">
              {amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={filters.amenities?.includes(amenity)}
                    onCheckedChange={() => handleAmenityChange(amenity)}
                  />
                  <Label htmlFor={amenity}>{amenity}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <Label>Ubicación</Label>
            <div className="space-y-2">
              <Input
                placeholder="Ciudad"
                value={filters.location?.city || ''}
                onChange={(e) => handleLocationChange({ city: e.target.value })}
              />
              <Input
                placeholder="Estado"
                value={filters.location?.state || ''}
                onChange={(e) => handleLocationChange({ state: e.target.value })}
              />
              <Input
                placeholder="País"
                value={filters.location?.country || ''}
                onChange={(e) => handleLocationChange({ country: e.target.value })}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button onClick={handleApplyFilters} className="flex-1">
              Aplicar Filtros
            </Button>
            <Button onClick={handleReset} variant="outline" className="flex-1">
              Limpiar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 