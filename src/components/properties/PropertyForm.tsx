import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUploader } from '@/components/gallery/ImageUploader';
import { Property, CreatePropertyDto } from '@/types/property.types';
import { toast } from '@/components/ui/use-toast';

interface PropertyFormProps {
  property?: Property;
  mode: 'create' | 'edit';
}

export function PropertyForm({ property, mode }: PropertyFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreatePropertyDto>({
    title: property?.title || '',
    description: property?.description || '',
    address: property?.address || '',
    city: property?.city || '',
    country: property?.country || '',
    price: property?.price || 0,
    currency: property?.currency || 'USD',
    property_type: property?.property_type || 'apartment',
    bedrooms: property?.bedrooms || 0,
    bathrooms: property?.bathrooms || 0,
    area_sqm: property?.area_sqm || 0,
    features: property?.features || {},
    images: property?.images || [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'bedrooms' || name === 'bathrooms' || name === 'area_sqm'
        ? Number(value)
        : value
    }));
  };

  const handleImageUpload = (images: any[]) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...images]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'create') {
        // Aquí iría la llamada a la API para crear la propiedad
        // await api.createProperty(formData);
        toast({
          title: "Property created",
          description: "Your property has been listed successfully.",
        });
      } else {
        // Aquí iría la llamada a la API para actualizar la propiedad
        // await api.updateProperty(property.id, formData);
        toast({
          title: "Property updated",
          description: "Your property has been updated successfully.",
        });
      }
      navigate('/my-properties');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'List New Property' : 'Edit Property'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, currency: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area_sqm">Area (m²)</Label>
              <Input
                id="area_sqm"
                name="area_sqm"
                type="number"
                value={formData.area_sqm}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Property Images</Label>
            <ImageUploader
              onUpload={handleImageUpload}
              maxFiles={10}
              acceptedFileTypes={['image/jpeg', 'image/png']}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? mode === 'create'
                ? 'Creating...'
                : 'Saving...'
              : mode === 'create'
                ? 'Create Property'
                : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 