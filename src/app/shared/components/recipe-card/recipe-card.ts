import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../models/recipe.model';

/** Displays a recipe in either result (after generation) or library (cookbook) style */
@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.scss'
})
export class RecipeCard {
  readonly recipe = input.required<Recipe>();
  readonly variant = input<'result' | 'library'>('result');
  readonly index = input<number>(0);
}
