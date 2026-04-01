import { ComplexityType, CuisineType, DietType, Ingredient } from './recipe.model';

/** Payload sent to the n8n webhook */
export interface RecipeRequest {
  ingredients: Ingredient[];
  portions: number;
  chefs: number;
  complexity: ComplexityType;
  cuisine: CuisineType;
  diet: DietType;
}

/** Quota status returned by n8n */
export interface QuotaInfo {
  ipQuotaRemaining: number;
  systemQuotaRemaining: number;
}
