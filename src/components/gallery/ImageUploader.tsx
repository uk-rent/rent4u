
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { PropertyImage } from '@/types/property.types';
import { Loader2, X, Upload } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (images: PropertyImage[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
}

export function ImageUploader({ 
  onUpload, 
  maxFiles = 5, 
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'] 
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState<{ file: File; preview: string }[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    // Check if exceeding max files
    if (previewImages.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can upload a maximum of ${maxFiles} images`,
        variant: "destructive",
      });
      return;
    }
    
    // Process each file
    const newPreviewImages = [...previewImages];
    
    Array.from(files).forEach(file => {
      // Check file type
      if (!acceptedFileTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `File ${file.name} is not an accepted image format`,
          variant: "destructive",
        });
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviewImages.push({
          file,
          preview: reader.result as string
        });
        setPreviewImages([...newPreviewImages]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  const handleUpload = async () => {
    if (previewImages.length === 0) return;
    
    setUploading(true);
    
    try {
      // In a real implementation, this would upload to a server or storage service
      // For now we'll simulate the upload and return mock URLs
      setTimeout(() => {
        const mockUploadedImages: PropertyImage[] = previewImages.map((img, index) => ({
          id: `img-${Date.now()}-${index}`, // Generate a unique ID
          url: img.preview,
          alt: `Property image ${index + 1}`,
          isMain: index === 0,
          order: index,
          width: 1200,
          height: 800,
        }));
        
        onUpload(mockUploadedImages);
        setPreviewImages([]);
        
        toast({
          title: "Upload successful",
          description: `${mockUploadedImages.length} images uploaded`,
        });
        
        setUploading(false);
      }, 1500);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your images",
        variant: "destructive",
      });
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* File Input */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
        <label htmlFor="image-upload" className="cursor-pointer block">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <span className="mt-2 block text-sm font-medium">
            Drop files here or click to upload
          </span>
          <span className="mt-1 block text-xs text-gray-500">
            {acceptedFileTypes.map(type => type.split('/')[1]).join(', ')} (Max: {maxFiles} files)
          </span>
          <input
            id="image-upload"
            type="file"
            multiple
            accept={acceptedFileTypes.join(',')}
            onChange={handleFileChange}
            className="sr-only"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Preview Area */}
      {previewImages.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {previewImages.map((img, index) => (
              <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-gray-100">
                <img
                  src={img.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  disabled={uploading}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-50"
                >
                  <X className="h-4 w-4 text-red-500" />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-1">
                    Main Image
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <Button 
            type="button" 
            onClick={handleUpload} 
            disabled={uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              `Upload ${previewImages.length} Image${previewImages.length === 1 ? '' : 's'}`
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
