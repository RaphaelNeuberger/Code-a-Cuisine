import { Routes } from '@angular/router';

/** Lazy-loaded route definitions for the application. */
export const routes: Routes = [
  { path: '', redirectTo: 'ingredients', pathMatch: 'full' },
  { path: 'ingredients', loadComponent: () => import('./pages/ingredients/ingredients').then(m => m.Ingredients) },
  { path: 'generate-recipe', loadComponent: () => import('./pages/generate-recipe/generate-recipe').then(m => m.GenerateRecipe) },
  { path: 'recipe-suggestions', loadComponent: () => import('./pages/recipe-suggestions/recipe-suggestions').then(m => m.RecipeSuggestions) },
  { path: 'recipe/:id', loadComponent: () => import('./pages/recipe-detail/recipe-detail').then(m => m.RecipeDetail) },
  { path: 'library', loadComponent: () => import('./pages/recipe-library/recipe-library').then(m => m.RecipeLibrary) },
  { path: 'cuisine/:cuisine', loadComponent: () => import('./pages/cuisine-recipes/cuisine-recipes').then(m => m.CuisineRecipes) },
  { path: 'settings', loadComponent: () => import('./pages/settings/settings').then(m => m.Settings) },
  { path: 'imprint', loadComponent: () => import('./pages/imprint/imprint').then(m => m.Imprint) },
  { path: '**', redirectTo: 'ingredients' }
];
