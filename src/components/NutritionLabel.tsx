import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export interface NutritionData {
  servingSize: string;
  servingsPerContainer: string;
  calories: number;
  totalFat: number;
  saturatedFat: number;
  transFat: number;
  cholesterol: number;
  sodium: number;
  totalCarbohydrate: number;
  dietaryFiber: number;
  totalSugars: number;
  addedSugars: number;
  protein: number;
  vitaminD: number;
  calcium: number;
  iron: number;
  potassium: number;
}

interface NutritionLabelProps {
  data: NutritionData;
  foodName: string;
}

export const NutritionLabel = ({ data, foodName }: NutritionLabelProps) => {
  const calculatePercentDV = (value: number, dailyValue: number) => {
    return Math.round((value / dailyValue) * 100);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="p-6 bg-background border-2 border-foreground/20 font-sans">
        <div className="space-y-1">
          {/* Header */}
          <div className="text-center space-y-1 mb-4">
            <h2 className="text-lg font-bold text-foreground">{foodName}</h2>
            <h3 className="text-2xl font-bold text-foreground border-b-8 border-foreground pb-2">
              Nutrition Facts
            </h3>
          </div>

          {/* Serving Info */}
          <div className="space-y-1 pb-2 border-b-4 border-foreground">
            <div className="text-sm">
              <span className="font-medium">Serving size</span> {data.servingSize}
            </div>
            <div className="text-sm">
              <span className="font-medium">Servings per container</span> {data.servingsPerContainer}
            </div>
          </div>

          {/* Calories */}
          <div className="flex justify-between items-end py-2 border-b-8 border-foreground">
            <span className="text-xl font-bold">Calories</span>
            <span className="text-3xl font-bold">{data.calories}</span>
          </div>

          {/* Daily Value Header */}
          <div className="text-right text-sm font-medium py-1 border-b border-foreground">
            % Daily Value*
          </div>

          {/* Nutrients */}
          <div className="space-y-0">
            <NutrientRow 
              label="Total Fat" 
              value={`${data.totalFat}g`} 
              percent={calculatePercentDV(data.totalFat, 65)} 
              bold 
            />
            <NutrientRow 
              label="Saturated Fat" 
              value={`${data.saturatedFat}g`} 
              percent={calculatePercentDV(data.saturatedFat, 20)} 
              indent 
            />
            <NutrientRow 
              label="Trans Fat" 
              value={`${data.transFat}g`} 
              indent 
            />
            <NutrientRow 
              label="Cholesterol" 
              value={`${data.cholesterol}mg`} 
              percent={calculatePercentDV(data.cholesterol, 300)} 
              bold 
            />
            <NutrientRow 
              label="Sodium" 
              value={`${data.sodium}mg`} 
              percent={calculatePercentDV(data.sodium, 2300)} 
              bold 
            />
            <NutrientRow 
              label="Total Carbohydrate" 
              value={`${data.totalCarbohydrate}g`} 
              percent={calculatePercentDV(data.totalCarbohydrate, 300)} 
              bold 
            />
            <NutrientRow 
              label="Dietary Fiber" 
              value={`${data.dietaryFiber}g`} 
              percent={calculatePercentDV(data.dietaryFiber, 25)} 
              indent 
            />
            <NutrientRow 
              label="Total Sugars" 
              value={`${data.totalSugars}g`} 
              indent 
            />
            <NutrientRow 
              label="Added Sugars" 
              value={`${data.addedSugars}g`} 
              percent={calculatePercentDV(data.addedSugars, 50)} 
              indent 
              subIndent 
            />
            <NutrientRow 
              label="Protein" 
              value={`${data.protein}g`} 
              bold 
              borderTop 
            />
          </div>

          {/* Vitamins and Minerals */}
          <div className="pt-2 border-t-8 border-foreground space-y-0">
            <NutrientRow 
              label="Vitamin D" 
              value={`${data.vitaminD}mcg`} 
              percent={calculatePercentDV(data.vitaminD, 20)} 
            />
            <NutrientRow 
              label="Calcium" 
              value={`${data.calcium}mg`} 
              percent={calculatePercentDV(data.calcium, 1300)} 
            />
            <NutrientRow 
              label="Iron" 
              value={`${data.iron}mg`} 
              percent={calculatePercentDV(data.iron, 18)} 
            />
            <NutrientRow 
              label="Potassium" 
              value={`${data.potassium}mg`} 
              percent={calculatePercentDV(data.potassium, 4700)} 
            />
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-foreground">
            <p className="text-xs leading-tight">
              *The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

interface NutrientRowProps {
  label: string;
  value: string;
  percent?: number;
  bold?: boolean;
  indent?: boolean;
  subIndent?: boolean;
  borderTop?: boolean;
}

const NutrientRow = ({ 
  label, 
  value, 
  percent, 
  bold = false, 
  indent = false, 
  subIndent = false,
  borderTop = false 
}: NutrientRowProps) => {
  const indentClass = subIndent ? "ml-8" : indent ? "ml-4" : "";
  const fontWeight = bold ? "font-bold" : "";
  const borderClass = borderTop ? "border-t border-foreground pt-1" : "";
  
  return (
    <div className={`flex justify-between text-sm py-0.5 ${borderClass}`}>
      <span className={`${indentClass} ${fontWeight}`}>{label} {value}</span>
      {percent !== undefined && (
        <span className={`font-bold`}>{percent}%</span>
      )}
    </div>
  );
};