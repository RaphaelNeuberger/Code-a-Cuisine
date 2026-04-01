import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
    return this.http.post<{ recipes: Recipe[] }>(environment.n8nWebhookUrl, request).pipe(
      map(response => response.recipes.map(r => ({
        ...r,
        createdAt: new Date(r.createdAt as unknown as string)
      }))),
      catchError((err: HttpErrorResponse) => throwError(() => new Error(this.mapError(err))))
    );
  }

  /** Maps HTTP error codes to German user-facing messages */
  private mapError(err: HttpErrorResponse): string {
    if (err.status === 429) return 'Tägliches Limit erreicht. Versuche es morgen wieder.';
    if (err.status >= 500) return 'Fehler beim Generieren. Bitte erneut versuchen.';
    return 'Keine Verbindung. Prüfe deine Internetverbindung.';
  }
}
