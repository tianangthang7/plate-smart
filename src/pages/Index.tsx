import { useState } from "react";
import { PhotoCapture } from "@/components/PhotoCapture";
import { NutritionLabel, NutritionData } from "@/components/NutritionLabel";
import { analyzeFood } from "@/services/nutritionAnalyzer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Utensils, Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [nutritionData, setNutritionData] = useState<{
    foodName: string;
    nutrition: NutritionData;
  } | null>(null);

  const handlePhotoCapture = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      const result = await analyzeFood(file);
      setNutritionData(result);
      toast.success("Food analyzed successfully!");
    } catch (error) {
      toast.error("Failed to analyze food. Please try again.");
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setNutritionData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10">
      {/* Header */}
      <header className="text-center py-8 px-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Utensils className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            NutriScan
          </h1>
        </div>
        <p className="text-muted-foreground max-w-md mx-auto">
          Instantly discover the nutritional content of any food with AI-powered analysis
        </p>
      </header>

      {/* Main Content */}
      <main className="container max-w-lg mx-auto px-4 pb-8">
        {!nutritionData ? (
          <div className="space-y-6">
            <PhotoCapture 
              onPhotoCapture={handlePhotoCapture}
              isAnalyzing={isAnalyzing}
            />
            
            {/* Features */}
            <Card className="p-6 bg-gradient-card">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">How it works</h3>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">1</span>
                  </div>
                  <span>Take a photo of your food or upload an image</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">2</span>
                  </div>
                  <span>AI analyzes the ingredients and portion size</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">3</span>
                  </div>
                  <span>Get detailed nutrition facts in FDA label format</span>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={resetAnalysis}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Analyze Another Food</span>
              </Button>
            </div>
            
            <NutritionLabel 
              data={nutritionData.nutrition}
              foodName={nutritionData.foodName}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 px-4 text-xs text-muted-foreground">
        <p>Nutritional information is estimated. Consult healthcare professionals for dietary advice.</p>
      </footer>
    </div>
  );
};

export default Index;