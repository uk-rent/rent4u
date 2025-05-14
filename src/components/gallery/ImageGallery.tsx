
import React from 'react';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ImageGalleryProps {
  images: { url: string; alt?: string }[];
  maxHeight?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images = [], 
  maxHeight = "500px" 
}) => {
  if (images.length === 0) {
    return (
      <Card className="overflow-hidden bg-gray-100 flex items-center justify-center" style={{ height: maxHeight }}>
        <div className="text-gray-400 flex flex-col items-center justify-center p-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>No images available</p>
        </div>
      </Card>
    );
  }

  // Show just the first image for now
  return (
    <div className="w-full" style={{ maxHeight }}>
      <AspectRatio ratio={16/9} className="bg-gray-200 overflow-hidden rounded-md">
        <img 
          src={images[0].url} 
          alt={images[0].alt || "Property image"} 
          className="w-full h-full object-cover"
        />
      </AspectRatio>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {images.slice(1, 5).map((image, i) => (
            <div key={i} className="aspect-square rounded-md overflow-hidden bg-gray-200">
              <img 
                src={image.url} 
                alt={image.alt || `Property image ${i+2}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
