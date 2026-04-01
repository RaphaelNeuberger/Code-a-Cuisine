import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ingredient } from '../../models/recipe.model';

const UNITS = ['g', 'ml', 'Stück', 'TL', 'EL', 'Tasse'];

/** Form for adding ingredients with amount + unit, displays a removable list */
@Component({
  selector: 'app-ingredient-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ingredient-input.html',
  styleUrl: './ingredient-input.scss'
})
export class IngredientInput {
  readonly ingredientsChange = output<Ingredient[]>();

  readonly ingredients = signal<Ingredient[]>([]);
  readonly units = UNITS;

  name = '';
  amount = 100;
  unit = 'g';
  editIndex: number | null = null;

  /** Adds current input values as a new ingredient to the list */
  addIngredient(): void {
    if (!this.name.trim()) return;
    const updated = [...this.ingredients(), { name: this.name.trim(), amount: this.amount, unit: this.unit }];
    this.ingredients.set(updated);
    this.ingredientsChange.emit(updated);
    this.name = '';
    this.amount = 100;
  }

  /** Removes ingredient at the given index from the list */
  removeIngredient(index: number): void {
    const updated = this.ingredients().filter((_, i) => i !== index);
    this.ingredients.set(updated);
    this.ingredientsChange.emit(updated);
  }

  /** Loads an ingredient into the form fields for editing */
  startEdit(index: number): void {
    const ing = this.ingredients()[index];
    this.name = ing.name;
    this.amount = ing.amount;
    this.unit = ing.unit;
    this.editIndex = index;
    this.removeIngredient(index);
  }
}
