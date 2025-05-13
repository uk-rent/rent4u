import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Property } from '@/types/property.types';
import { ImageGallery } from '@/components/gallery/ImageGallery';
import { PropertyMap } from '@/components/maps/PropertyMap';
import { BookingForm } from '@/components/bookings/BookingForm';

export function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Aquí iría la lógica para cargar los detalles de la propiedad
  // useEffect(() => {
  //   const fetchProperty = async () => {
  //     try {
  //       const response = await api.getProperty(id);
  //       setProperty(response.data);
  //     } catch (error) {
  //       console.error('Error fetching property:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchProperty();
  // }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Image Gallery */}
      <ImageGallery images={property.images} />

      {/* Property Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h1 className="text-2xl font-bold mb-4">{property.title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <Badge variant="outline">{property.property_type}</Badge>
                {property.is_featured && (
                  <Badge className="bg-primary">Featured</Badge>
                )}
              </div>
              <p className="text-gray-600 mb-4">{property.description}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                {property.bedrooms !== undefined && (
                  <div>
                    <h3 className="font-medium">Bedrooms</h3>
                    <p>{property.bedrooms}</p>
                  </div>
                )}
                {property.bathrooms !== undefined && (
                  <div>
                    <h3 className="font-medium">Bathrooms</h3>
                    <p>{property.bathrooms}</p>
                  </div>
                )}
                {property.area_sqm !== undefined && (
                  <div>
                    <h3 className="font-medium">Area</h3>
                    <p>{property.area_sqm} m²</p>
                  </div>
                )}
              </div>

              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  {/* Property details content */}
                </TabsContent>
                <TabsContent value="location">
                  <PropertyMap
                    latitude={property.latitude}
                    longitude={property.longitude}
                  />
                </TabsContent>
                <TabsContent value="features">
                  {/* Property features content */}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold mb-4">
                ${property.price}/month
              </div>
              <BookingForm propertyId={property.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 