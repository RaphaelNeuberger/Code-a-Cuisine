/** Supported cuisine styles */
export type CuisineType = 'german' | 'italian' | 'japanese' | 'indian' | 'gourmet' | 'fusion';

/** Supported diet filters */
export type DietType = 'vegetarian' | 'vegan' | 'keto' | 'none';

/** Recipe complexity / time categories */
export type ComplexityType = 'quick' | 'medium' | 'complex';

/** A single ingredient with amount and unit */
export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

/** Nutritional values per portion */
export interface NutritionFacts {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

/** One preparation step in a recipe */
export interface RecipeStep {
  stepNumber: number;
  title: string;
  description: string;
  chef?: 1 | 2 | 3;
  durationMinutes?: number;
  isParallel?: boolean;
}

/** A complete recipe as stored in Firestore */
export interface Recipe {
  id?: string;
  title: string;
  cookingTimeMinutes: number;
  cuisine: CuisineType;
  diet: DietType;
  complexity: ComplexityType;
  portions: number;
  chefs: number;
  ingredients: Ingredient[];
  extraIngredients?: Ingredient[];
  steps: RecipeStep[];
  nutrition?: NutritionFacts;
  hearts: number;
  thumbnailUrl?: string;
  createdAt: Date;
}
