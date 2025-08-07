import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Upload, X, Loader2, CameraOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoCaptureProps {
  onPhotoCapture: (file: File) => void;
  isAnalyzing: boolean;
}

export const PhotoCapture = ({ onPhotoCapture, isAnalyzing }: PhotoCaptureProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isCameraMode, setIsCameraMode] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const startCamera = async () => {
    try {
      setIsStartingCamera(true);
      setCameraError(null);
      console.log('Requesting camera access...');
      
      let stream: MediaStream;
      
      try {
        // Try with environment camera first (back camera on mobile)
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
      } catch (envError) {
        console.log('Environment camera not available, trying default camera');
        // Fallback to any available camera
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
      }
      
      console.log('Camera stream obtained:', stream);
      setCameraStream(stream);
      setIsCameraMode(true);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Unable to access camera. Please check permissions and ensure you\'re using HTTPS.');
    } finally {
      setIsStartingCamera(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraMode(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob and create file
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        handleImageFile(file);
        stopCamera();
      }
    }, 'image/jpeg', 0.9);
  };

  // Handle video stream assignment when camera stream changes
  useEffect(() => {
    const assignStreamToVideo = async () => {
      if (cameraStream && videoRef.current) {
        console.log('Assigning stream to video element');
        videoRef.current.srcObject = cameraStream;
        
        try {
          await videoRef.current.play();
          console.log('Video is now playing');
        } catch (error) {
          console.error('Error playing video:', error);
          setCameraError('Unable to start video playback.');
        }
      }
    };

    assignStreamToVideo();
  }, [cameraStream]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {!previewImage && !isCameraMode ? (
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

            {cameraError && (
              <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                {cameraError}
              </div>
            )}

            <div className="space-y-3">
              <Button
                variant="capture"
                size="lg"
                className="w-full"
                onClick={startCamera}
                disabled={isAnalyzing || isStartingCamera}
              >
                {isStartingCamera ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Starting Camera...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    Open Camera
                  </>
                )}
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
      ) : isCameraMode ? (
        <Card className="p-6 space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 object-cover rounded-lg shadow-medium bg-black"
              onLoadedMetadata={() => console.log('Video metadata loaded')}
              onPlay={() => console.log('Video started playing')}
              onError={(e) => {
                console.error('Video error:', e);
                setCameraError('Video playback error occurred.');
              }}
            />
            
            {/* Loading overlay for when camera is starting */}
            {!cameraStream && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <div className="text-white text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm">Loading camera...</p>
                </div>
              </div>
            )}
            
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={stopCamera}
              disabled={isAnalyzing}
            >
              <CameraOff className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="capture"
              size="lg"
              className="flex-1"
              onClick={capturePhoto}
              disabled={isAnalyzing || !cameraStream}
            >
              <Camera className="w-5 h-5" />
              Capture
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={stopCamera}
              disabled={isAnalyzing}
            >
              Cancel
            </Button>
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

      {/* Hidden elements */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};