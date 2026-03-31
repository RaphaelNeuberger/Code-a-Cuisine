import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', redirectTo: 'ingredients', pathMatch: 'full' },
	{ path: 'ingredients', loadComponent: () => import('./pages/ingredients/ingredients.component').then(m => m.IngredientsComponent) },
	{ path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent) },
	{ path: 'recipe-suggestions', loadComponent: () => import('./pages/recipe-suggestions/recipe-suggestions.component').then(m => m.RecipeSuggestionsComponent) },
	{ path: 'recipe/:id', loadComponent: () => import('./pages/recipe-detail/recipe-detail.component').then(m => m.RecipeDetailComponent) },
	{ path: 'library', loadComponent: () => import('./pages/recipe-library/recipe-library.component').then(m => m.RecipeLibraryComponent) },
	{ path: 'imprint', loadComponent: () => import('./pages/imprint/imprint.component').then(m => m.ImprintComponent) },
	{ path: '**', redirectTo: 'ingredients' }
];
