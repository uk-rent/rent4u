
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { propertyData } from "@/data/properties";

const PropertiesPage = () => {
  const [priceRange, setPriceRange] = useState([300, 5000]);
  const [properties, setProperties] = useState(propertyData);
  
  const toggleFavorite = (id) => {
    // Implementation for toggling favorites would go here
    console.log("Toggle favorite for property:", id);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-alternate">
        <div className="bg-primary text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Find Your Perfect Property</h1>
            <p className="text-xl max-w-2xl">
              Browse our extensive collection of rental properties across London
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4 bg-white p-6 rounded-lg shadow-sm h-fit">
              <h2 className="text-xl font-bold mb-4">Filter Properties</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <Input placeholder="Search by location" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All property types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All property types</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="room">Room</SelectItem>
                      <SelectItem value="house">Shared House</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4+">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">Price Range</label>
                    <span className="text-sm text-primary font-medium">£{priceRange[0]} - £{priceRange[1]}/month</span>
                  </div>
                  <div className="px-2">
                    <Slider
                      defaultValue={[300, 5000]}
                      max={10000}
                      min={300}
                      step={100}
                      onValueChange={(value) => setPriceRange(value)}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">£300</span>
                    <span className="text-xs text-gray-500">£10,000+</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any time</SelectItem>
                      <SelectItem value="now">Available Now</SelectItem>
                      <SelectItem value="month">Within a Month</SelectItem>
                      <SelectItem value="quarter">Within 3 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full bg-primary hover:bg-primary-hover">Apply Filters</Button>
              </div>
            </div>
            
            {/* Properties Grid */}
            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">{properties.length} properties found</p>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="price-asc">Price low to high</SelectItem>
                    <SelectItem value="price-desc">Price high to low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <Card key={property.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
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
                        onClick={() => toggleFavorite(property.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
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
                        
                        {property.beds !== undefined && (
                          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                            {property.beds} {property.beds === 1 ? 'Bedroom' : property.beds === 0 ? 'Studio' : 'Bedrooms'}
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
                ))}
              </div>
              
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-1">
                  <Button variant="outline" size="sm" className="px-3">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="bg-primary text-white px-3">
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="px-3">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="px-3">
                    3
                  </Button>
                  <Button variant="outline" size="sm" className="px-3">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertiesPage;
