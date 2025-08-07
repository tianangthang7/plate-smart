import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoCaptureProps {
  onPhotoCapture: (file: File) => void;
  isAnalyzing: boolean;
}

export const PhotoCapture = ({ onPhotoCapture, isAnalyzing }: PhotoCaptureProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleImageFile = (file: File) => {
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Pass file to parent
    onPhotoCapture(file);
  };

  const clearImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {!previewImage ? (
        <Card className="p-8 text-center border-2 border-dashed border-primary/20 bg-gradient-card hover:border-primary/40 transition-smooth">
          <div className="space-y-6">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <Camera className="w-8 h-8 text-primary-foreground" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Capture Your Food
              </h3>
              <p className="text-muted-foreground text-sm">
                Take a photo or upload an image of any dish to get instant nutritional information
              </p>
            </div>

            <div className="space-y-3">
              <Button
                variant="capture"
                size="lg"
                className="w-full"
                onClick={() => cameraInputRef.current?.click()}
                disabled={isAnalyzing}
              >
                <Camera className="w-5 h-5" />
                Take Photo
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
              >
                <Upload className="w-5 h-5" />
                Upload Image
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6 space-y-4">
          <div className="relative">
            <img
              src={previewImage}
              alt="Food preview"
              className="w-full h-64 object-cover rounded-lg shadow-medium"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={clearImage}
              disabled={isAnalyzing}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {isAnalyzing && (
            <div className="flex items-center justify-center py-4 space-x-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Analyzing nutritional content...
              </span>
            </div>
          )}
        </Card>
      )}

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};