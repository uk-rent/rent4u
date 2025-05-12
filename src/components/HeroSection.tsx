import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const HeroSection = () => {
  const [priceRange, setPriceRange] = useState([300, 5000]);

  return (
    <div 
      className="relative hero-section min-h-[600px] md:min-h-[700px] flex items-center justify-center py-20" 
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/hero-background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-4 relative z-10 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-10">
          {/* Left Column */}
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-[Playfair Display]">
              Find Your Ideal
              <span className="block">Shared Room in</span>
              <span className="text-primary">London</span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 font-[Playfair Display]">
              Comfortable and affordable rooms in London's best locations, perfect for
              students and young professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/search" className="w-full sm:w-auto">
                <Button className="w-full bg-primary hover:bg-primary-hover text-white" size="lg">
                  Start Your Search
                </Button>
              </Link>
              <Link to="/how-it-works" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full bg-white/10 border-white text-white hover:bg-white/20" size="lg">
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Right Column - Search Form */}
          <div className="w-full md:w-1/2 mt-12 md:mt-0">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h2 className="ml-2 text-xl font-bold text-gray-800">Search Properties</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Location</label>
                  <div className="relative">
                    <svg className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <Input 
                      placeholder="Enter address, neighbourhood, or zipcode" 
                      className="pl-10 bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Property Type</label>
                  <Select>
                    <SelectTrigger className="w-full bg-white border-gray-300 text-gray-800">
                      <SelectValue placeholder="All property types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All property types</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="room">Room</SelectItem>
                      <SelectItem value="shared-house">Shared House</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-800">Price (up to)</label>
                    <span className="text-sm text-primary font-medium">£{priceRange[1]}/month</span>
                  </div>
                  <div className="px-2">
                    <Slider 
                      defaultValue={[300]} 
                      max={5000} 
                      min={300} 
                      step={100} 
                      onValueChange={value => setPriceRange([300, value[0]])}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-600">£{priceRange[0]}</span>
                    <span className="text-xs text-gray-600">£5,000+</span>
                  </div>
                </div>
                
                <Button className="w-full bg-primary hover:bg-primary-hover text-white font-semibold">
                  Search Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;