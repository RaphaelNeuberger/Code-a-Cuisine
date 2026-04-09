import { Injectable, signal } from '@angular/core';
import { Recipe, Ingredient } from '../models/recipe.model';
import { RecipeRequest } from '../models/request.model';

/** Holds the current recipe generation request and results across page navigation */
@Injectable({ providedIn: 'root' })
export class RecipeStateService {
  readonly request = signal<RecipeRequest | null>(null);
  readonly recipes = signal<Recipe[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly ingredients = signal<Ingredient[]>([]);

  /** @param r - the user's current ingredient + preference request */
  setRequest(r: RecipeRequest): void {
    this.request.set(r);
  }

  /** @param recipes - the 3 recipes returned by n8n */
  setRecipes(recipes: Recipe[]): void {
    this.recipes.set(recipes);
  }

  /** @param loading - whether recipe generation is in progress */
  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  /** @param ingredients - the user's selected ingredients */
  setIngredients(ingredients: Ingredient[]): void {
    this.ingredients.set(ingredients);
  }
}
