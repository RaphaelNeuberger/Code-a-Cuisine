import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Recipe } from '../models/recipe.model';
import { RecipeRequest } from '../models/request.model';

/** Sends recipe generation requests to the n8n webhook */
@Injectable({ providedIn: 'root' })
export class N8nService {
  private readonly http = inject(HttpClient);

  /**
   * Sends user ingredients and preferences to n8n and returns 3 recipes.
   * @param request - user's ingredient list and cooking preferences
   */
  generateRecipes(request: RecipeRequest): Observable<Recipe[]> {
    const headers = new HttpHeaders({ 'codeacousine-webhook-secret': environment.n8nWebhookSecret });
    return this.http.post<{ recipes: any[] }>(environment.n8nWebhookUrl, request, { headers }).pipe(
      map(response => response.recipes.map(r => this.normalizeRecipe(r))),
      catchError((err: HttpErrorResponse) => throwError(() => this.mapError(err)))
    );
  }

  /** Normalizes GPT field name variations to the internal Recipe model */
  private normalizeRecipe(r: any): Recipe {
    return {
      ...r,
      cookingTimeMinutes: r.cookingTimeMinutes ?? r.durationMinutes ?? r.cookingTime ?? 0,
      hearts: r.hearts ?? r.likes ?? 0,
      steps: Array.isArray(r.steps)
        ? r.steps.map((s: any, i: number) =>
            typeof s === 'string'
              ? { stepNumber: i + 1, title: `Step ${i + 1}`, description: s }
              : s
          )
        : [],
      ingredients: r.ingredients ?? [],
      extraIngredients: r.extraIngredients ?? [],
      createdAt: new Date(r.createdAt ?? Date.now()),
    } as Recipe;
  }

  /** Maps HTTP error codes to user-facing errors with optional quota flag */
  private mapError(err: HttpErrorResponse): Error {
    if (err.status === 429) {
      const e = new Error('QUOTA_EXCEEDED');
      (e as any)['quota'] = true;
      return e;
    }
    if (err.status >= 500) return new Error('Fehler beim Generieren. Bitte erneut versuchen.');
    return new Error('Keine Verbindung. Prüfe deine Internetverbindung.');
  }
}
