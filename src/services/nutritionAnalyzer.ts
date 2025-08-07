import { NutritionData } from "@/components/NutritionLabel";

// This is a mock service that simulates AI analysis
// In a real app, this would call an AI service like OpenAI Vision API
export const analyzeFood = async (imageFile: File): Promise<{ foodName: string; nutrition: NutritionData }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock analysis based on file name or return generic healthy meal data
  const mockResults = [
    {
      foodName: "Grilled Chicken Salad",
      nutrition: {
        servingSize: "1 bowl (300g)",
        servingsPerContainer: "1",
        calories: 320,
        totalFat: 12,
        saturatedFat: 3,
        transFat: 0,
        cholesterol: 85,
        sodium: 580,
        totalCarbohydrate: 15,
        dietaryFiber: 5,
        totalSugars: 8,
        addedSugars: 2,
        protein: 35,
        vitaminD: 0,
        calcium: 120,
        iron: 3,
        potassium: 650
      }
    },
    {
      foodName: "Avocado Toast",
      nutrition: {
        servingSize: "2 slices (180g)",
        servingsPerContainer: "1",
        calories: 420,
        totalFat: 22,
        saturatedFat: 4,
        transFat: 0,
        cholesterol: 0,
        sodium: 380,
        totalCarbohydrate: 45,
        dietaryFiber: 12,
        totalSugars: 6,
        addedSugars: 0,
        protein: 14,
        vitaminD: 0,
        calcium: 80,
        iron: 4,
        potassium: 890
      }
    },
    {
      foodName: "Quinoa Buddha Bowl",
      nutrition: {
        servingSize: "1 bowl (400g)",
        servingsPerContainer: "1",
        calories: 485,
        totalFat: 18,
        saturatedFat: 3,
        transFat: 0,
        cholesterol: 0,
        sodium: 420,
        totalCarbohydrate: 68,
        dietaryFiber: 14,
        totalSugars: 12,
        addedSugars: 0,
        protein: 18,
        vitaminD: 0,
        calcium: 150,
        iron: 6,
        potassium: 1200
      }
    }
  ];

  // Return random mock result
  const randomIndex = Math.floor(Math.random() * mockResults.length);
  return mockResults[randomIndex];
};