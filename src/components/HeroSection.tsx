import { useState } from "react";
import Link from "next/link";
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
        backgroundImage: `url('/images/hero-background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto px-4 relative z-10 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-10">
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-[Playfair Display]">
              Encuentra tu
              <span className="block">Habitación Ideal en</span>
              <span className="text-primary">Londres</span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 font-[Playfair Display]">
              Habitaciones cómodas y asequibles en las mejores ubicaciones de Londres,
              perfectas para estudiantes y jóvenes profesionales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/search" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-primary hover:bg-primary-hover text-white">
                  Iniciar Búsqueda
                </Button>
              </Link>
              <Link href="/how-it-works" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full bg-transparent border-white text-white hover:bg-white/10">
                  Cómo Funciona
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 mt-12 md:mt-0">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h2 className="ml-2 text-xl font-bold text-secondary">Buscar Propiedades</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                  <div className="relative">
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <Input placeholder="Ingresa dirección, barrio o código postal" className="pl-10" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Propiedad</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Todos los tipos de propiedades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <SelectItem value="apartment">Apartamento</SelectItem>
                      <SelectItem value="room">Habitación</SelectItem>
                      <SelectItem value="shared-house">Casa Compartida</SelectItem>
                      <SelectItem value="studio">Estudio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">Precio (hasta)</label>
                    <span className="text-sm text-primary font-medium">£{priceRange[1]}/mes</span>
                  </div>
                  <div className="px-2">
                    <Slider
                      defaultValue={[5000]}
                      max={5000}
                      min={300}
                      step={100}
                      onValueChange={(value) => setPriceRange([300, value[0]])}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">£{priceRange[0]}</span>
                    <span className="text-xs text-gray-500">£5,000+</span>
                  </div>
                </div>
                
                <Button className="w-full bg-primary hover:bg-primary-hover text-white">
                  Buscar Ahora
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