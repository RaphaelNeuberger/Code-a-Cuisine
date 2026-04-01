import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RecipeService } from '../../shared/services/recipe.service';
import { Recipe } from '../../shared/models/recipe.model';

/** Full recipe view with ingredients, directions, nutrition, and heart button */
@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss'
})
export class RecipeDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly recipeService = inject(RecipeService);

  readonly recipe = signal<Recipe | null>(null);
  readonly hearted = signal<boolean>(false);

  /** Loads recipe from Firestore using route param id */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.recipeService.getRecipe(id).subscribe(r => this.recipe.set(r));
  }

  /**
   * Increments the heart counter once per session.
   * @param id - Firestore document ID
   */
  async heart(id: string): Promise<void> {
    if (this.hearted()) return;
    await this.recipeService.incrementHearts(id);
    this.hearted.set(true);
    const current = this.recipe();
    if (current) this.recipe.set({ ...current, hearts: current.hearts + 1 });
  }

  /** Calculates total nutrition for the whole recipe (portions × per-portion values) */
  totalNutrition(perPortion: number, portions: number): number {
    return Math.round(perPortion * portions);
  }

  /** Returns CSS class for chef badge color */
  chefClass(chef: 1 | 2 | 3 | undefined): string {
    if (chef === 1) return 'step__chef--1';
    if (chef === 2) return 'step__chef--2';
    return '';
  }
}
