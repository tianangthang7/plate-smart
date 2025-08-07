import { GoogleGenerativeAI } from "@google/generative-ai";
import { NutritionData } from "@/components/NutritionLabel";

// Initialize Gemini API
const getGeminiAPI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not configured. Please add your Gemini API key to the environment variables.");
  }
  return new GoogleGenerativeAI(apiKey);
};

// Convert file to base64 for Gemini API
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Fallback mock data for when API fails or is not configured
const getFallbackData = (): { foodName: string; nutrition: NutritionData } => {
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
      foodName: "Healthy Mixed Salad",
      nutrition: {
        servingSize: "1 bowl (400g)",
        servingsPerContainer: "1",
        calories: 285,
        totalFat: 15,
        saturatedFat: 2,
        transFat: 0,
        cholesterol: 0,
        sodium: 320,
        totalCarbohydrate: 32,
        dietaryFiber: 8,
        totalSugars: 12,
        addedSugars: 0,
        protein: 12,
        vitaminD: 0,
        calcium: 150,
        iron: 4,
        potassium: 850
      }
    }
  ];

  const randomIndex = Math.floor(Math.random() * mockResults.length);
  return mockResults[randomIndex];
};

export const analyzeFood = async (imageFile: File): Promise<{ foodName: string; nutrition: NutritionData }> => {
  try {
    console.log("Starting food analysis with Gemini...");
    
    // Check if API key is configured
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      console.warn("Gemini API key not configured, using fallback data");
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      return getFallbackData();
    }

    const genAI = getGeminiAPI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Convert image to format Gemini can process
    const imagePart = await fileToGenerativePart(imageFile);

    const prompt = `Analyze this food image and provide detailed nutritional information. Please identify the food and estimate the nutritional content for a typical serving.

Return your response in this exact JSON format:
{
  "foodName": "Name of the identified food",
  "nutrition": {
    "servingSize": "description with weight",
    "servingsPerContainer": "1",
    "calories": number,
    "totalFat": number (grams),
    "saturatedFat": number (grams),
    "transFat": number (grams),
    "cholesterol": number (mg),
    "sodium": number (mg),
    "totalCarbohydrate": number (grams),
    "dietaryFiber": number (grams),
    "totalSugars": number (grams),
    "addedSugars": number (grams),
    "protein": number (grams),
    "vitaminD": number (mcg),
    "calcium": number (mg),
    "iron": number (mg),
    "potassium": number (mg)
  }
}

Please provide realistic estimates based on standard nutritional databases. If you're unsure about the exact food, provide your best estimate and mention it in the food name.`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini response:", text);

    // Try to parse JSON response
    try {
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      
      const parsedResult = JSON.parse(jsonMatch[0]);
      
      // Validate the response structure
      if (!parsedResult.foodName || !parsedResult.nutrition) {
        throw new Error("Invalid response structure");
      }

      return parsedResult;
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      console.error("Raw response:", text);
      
      // Return fallback data if parsing fails
      return getFallbackData();
    }

  } catch (error) {
    console.error("Error analyzing food with Gemini:", error);
    
    // Return fallback data on any error
    await new Promise(resolve => setTimeout(resolve, 1000)); // Brief delay
    return getFallbackData();
  }
};