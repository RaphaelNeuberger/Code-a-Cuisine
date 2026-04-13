import { Component, output, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ingredient } from '../../models/recipe.model';
import { CustomIngredientsService } from '../../services/custom-ingredients.service';

const UNITS = ['g', 'ml', 'pcs', 'tsp', 'tbsp', 'cup'];

/** Which units are valid per ingredient category */
const UNIT_SETS = {
  liquid:     ['ml', 'cup', 'tbsp', 'tsp'],
  meat_fish:  ['g'],
  countable:  ['pcs', 'g'],
  spice:      ['tsp', 'tbsp', 'g'],
  grain_nut:  ['g', 'cup', 'tbsp', 'tsp'],
} as const;

type UnitCategory = keyof typeof UNIT_SETS;

/** Maps known ingredients to their unit category. Unlisted ingredients → all units. */
const INGREDIENT_CATEGORY: Record<string, UnitCategory> = {
  // Liquids
  'Milk': 'liquid', 'Apple juice': 'liquid', 'Coconut milk': 'liquid',
  'Coconut cream': 'liquid', 'Soy sauce': 'liquid', 'White wine': 'liquid',
  'Corn oil': 'liquid', 'Olive oil': 'liquid', 'Sesame oil': 'liquid',
  'Sunflower oil': 'liquid', 'Buttermilk': 'liquid',

  // Meats & fish (only g makes sense)
  'Chicken': 'meat_fish', 'Beef': 'meat_fish', 'Lamb': 'meat_fish',
  'Salmon': 'meat_fish', 'Trout': 'meat_fish', 'Tuna': 'meat_fish',
  'Cod': 'meat_fish', 'Mackerel': 'meat_fish', 'Ground meat': 'meat_fish',
  'Turkey': 'meat_fish', 'Shrimp': 'meat_fish', 'Mussels': 'meat_fish',
  'Scallops': 'meat_fish', 'Smoked salmon': 'meat_fish', 'Fish': 'meat_fish',

  // Countable (pcs or g)
  'Eggs': 'countable', 'Avocado': 'countable', 'Lemon': 'countable',
  'Lime': 'countable', 'Grapefruit': 'countable', 'Oranges': 'countable',
  'Apples': 'countable', 'Bananas': 'countable', 'Peaches': 'countable',
  'Pears': 'countable', 'Plum': 'countable', 'Onions': 'countable',
  'Potatoes': 'countable', 'Zucchini': 'countable', 'Eggplant': 'countable',

  // Spices & dry herbs
  'Basil': 'spice', 'Dill': 'spice', 'Oregano': 'spice', 'Thyme': 'spice',
  'Rosemary': 'spice', 'Marjoram': 'spice', 'Cilantro': 'spice',
  'Chives': 'spice', 'Cumin': 'spice', 'Black cumin': 'spice',
  'Lavender': 'spice', 'Mint': 'spice', 'Parsley': 'spice',
  'Papaya seeds': 'spice', 'Poppy seeds': 'spice', 'Ginger': 'spice',

  // Grains, nuts, seeds, pulses (g or volume, never pcs)
  'Flour': 'grain_nut', 'Sugar': 'grain_nut', 'Oats': 'grain_nut',
  'Bulgur': 'grain_nut', 'Quinoa': 'grain_nut', 'Rice': 'grain_nut',
  'Spelt': 'grain_nut', 'Wheat berries': 'grain_nut', 'Wheat bran': 'grain_nut',
  'Whole wheat flour': 'grain_nut', 'Polenta': 'grain_nut',
  'Almonds': 'grain_nut', 'Walnuts': 'grain_nut', 'Peanuts': 'grain_nut',
  'Pecans': 'grain_nut', 'Pistachios': 'grain_nut', 'Brazil nuts': 'grain_nut',
  'Macadamia': 'grain_nut', 'Mixed nuts': 'grain_nut', 'Nuts': 'grain_nut',
  'Pine nuts': 'grain_nut', 'Pumpkin seeds': 'grain_nut', 'Seeds': 'grain_nut',
  'Sesame': 'grain_nut', 'Sesame seeds': 'grain_nut', 'Sunflower seeds': 'grain_nut',
  'Chickpeas': 'grain_nut', 'Lentils': 'grain_nut', 'Red lentils': 'grain_nut',
  'Beans': 'grain_nut', 'Edamame': 'grain_nut', 'Peas': 'grain_nut',
  'Desiccated coconut': 'grain_nut',
};

const INGREDIENTS = [
  // A
  'Almonds', 'Apples', 'Apple juice', 'Applesauce', 'Apricots', 'Artichokes', 'Arugula',
  'Asparagus', 'Avocado',
  // B
  'Bacon', 'Bananas', 'Basil', 'Beans', 'Beef', 'Beets', 'Bell pepper', 'Black Forest ham',
  'Black cumin', 'Blueberries', 'Brazil nuts', 'Bread', 'Bread rolls', 'Broccoli',
  'Brussels sprouts', 'Bulgur', 'Butter', 'Buttermilk',
  // C
  'Cabbage', 'Carrots', 'Cauliflower', 'Celery', 'Cheese', 'Cherries', 'Chicken',
  'Chickpeas', 'Chili', 'Chives', 'Chorizo', 'Cilantro', 'Coconut cream', 'Coconut milk',
  'Cod', 'Corn', 'Corn oil', 'Cranberries', 'Crème fraîche', 'Cucumber', 'Cumin',
  // D
  'Dates', 'Desiccated coconut', 'Dill',
  // E
  'Edamame', 'Eggplant', 'Eggs',
  // F
  'Fennel', 'Feta', 'Fish', 'Flour',
  // G
  'Garlic', 'Ginger', 'Goat cheese', 'Gouda', 'Grapes', 'Grapefruit', 'Ground meat',
  // H
  'Ham', 'Harissa', 'Heavy cream', 'Honey',
  // K
  'Kale',
  // L
  'Lamb', 'Field salad', 'Lavender', 'Leek', 'Lemon', 'Lentils', 'Lime',
  // M
  'Macadamia', 'Mackerel', 'Mango', 'Marjoram', 'Mascarpone', 'Milk', 'Mint',
  'Mixed nuts', 'Mozzarella', 'Mushrooms', 'Mussels',
  // N
  'Nut butter', 'Nuts',
  // O
  'Oats', 'Olive oil', 'Onions', 'Oranges', 'Oregano',
  // P
  'Papaya seeds', 'Parmesan', 'Parsley', 'Pasta', 'Peaches', 'Peanut butter', 'Peanuts',
  'Pears', 'Pecans', 'Peas', 'Pine nuts', 'Pineapple', 'Pistachios', 'Plum', 'Polenta',
  'Poppy seeds', 'Potatoes', 'Pumpkin', 'Pumpkin seeds',
  // Q
  'Quinoa',
  // R
  'Raspberries', 'Red lentils', 'Rice', 'Rosemary',
  // S
  'Salami', 'Salmon', 'Savoy cabbage', 'Scallops', 'Seeds', 'Seitan', 'Sesame',
  'Sesame oil', 'Sesame seeds', 'Shallots', 'Shrimp', 'Smoked salmon', 'Sour cherries',
  'Sour cream', 'Soy sauce', 'Spelt', 'Spinach', 'Strawberries', 'Sugar',
  'Sunflower oil', 'Sunflower seeds', 'Sweet potatoes',
  // T
  'Tamarind', 'Tempeh', 'Thyme', 'Tofu', 'Tomato paste', 'Tomatoes', 'Trout', 'Tuna',
  'Turkey',
  // U
  'Udon noodles',
  // W
  'Walnuts', 'Wasabi', 'Wheat berries', 'Wheat bran', 'Whole wheat flour', 'White wine',
  // Y
  'Yogurt',
  // Z
  'Zucchini',
];

/** Detects a unit category from keyword patterns in the ingredient name. Returns null if no match. */
function detectCategoryByKeyword(name: string): UnitCategory | null {
  const s = name.toLowerCase();
  if (/\b(oil|juice|milk|wine|cream|water|broth|stock|syrup|sauce|vinegar)\b/.test(s)) return 'liquid';
  if (/\b(powder|spice|herb|dried|flakes|seeds?|pollen)\b/.test(s)) return 'spice';
  if (/\b(flour|sugar|grain|wheat|rice|oat|bran|bulgur|quinoa|lentil|bean|pea|nut|almond|walnut|pecan|pistachio|cashew)\b/.test(s)) return 'grain_nut';
  if (/\b(fillet|steak|breast|thigh|wing|mince|minced|ground|chop|loin|rib|roast)\b/.test(s)) return 'meat_fish';
  return null;
}

/** Checks if a string looks like a real word (has vowels, no wild consonant clusters, valid chars only). */
function isLikelyIngredient(name: string): boolean {
  const s = name.trim();
  if (s.length < 2) return false;
  // Only letters (including accented/umlaut), spaces, hyphens, apostrophes
  if (!/^[a-zA-ZäöüÄÖÜßàáâãåæçèéêëìíîïðñòóôõøùúûýþÿÀÁÂÃÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕØÙÚÛÝÞŸ\s\-'']+$/.test(s)) return false;
  // Must have at least one vowel
  if (!/[aeiouäöüàáâãåæèéêëìíîïòóôõøùúûý]/i.test(s)) return false;
  // No run of 5+ consecutive consonants (catches "lkjsdf" style gibberish)
  if (/[^aeiouäöüàáâãåæèéêëìíîïòóôõøùúûý\s\-'']{5,}/i.test(s)) return false;
  return true;
}

/** Form for adding ingredients with amount + unit, displays a removable list */
@Component({
  selector: 'app-ingredient-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ingredient-input.html',
  styleUrl: './ingredient-input.scss'
})
export class IngredientInput {
  private readonly customService = inject(CustomIngredientsService);

  readonly ingredientsChange = output<Ingredient[]>();

  readonly ingredients = signal<Ingredient[]>([]);
  readonly units = UNITS;
  readonly suggestions = signal<string[]>([]);

  private allIngredients(): string[] {
    return [...INGREDIENTS, ...this.customService.list()];
  }

  name = '';
  amount = 100;
  unit = 'g';
  editIndex: number | null = null;
  nameError = false;
  notInListError = false;
  amountError = false;
  activeSuggestionIndex = -1;

  get isEditing(): boolean { return this.editIndex !== null; }

  /** Returns the allowed units for the currently entered ingredient name. */
  get availableUnits(): string[] {
    const trimmed = this.name.trim();
    const known = INGREDIENT_CATEGORY[trimmed];
    if (known) return [...UNIT_SETS[known]];
    const detected = detectCategoryByKeyword(trimmed);
    if (detected) return [...UNIT_SETS[detected]];
    return UNITS;
  }

  /** Resets the unit to the first valid one when the ingredient name changes. */
  private syncUnit(): void {
    if (!this.availableUnits.includes(this.unit)) {
      this.unit = this.availableUnits[0];
    }
  }

  /** Blocks digit keys and handles arrow-key navigation and Enter/Escape for the suggestion list. */
  blockDigits(event: KeyboardEvent): void {
    if (/^\d$/.test(event.key)) { event.preventDefault(); return; }
    const list = this.suggestions();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeSuggestionIndex = Math.min(this.activeSuggestionIndex + 1, list.length - 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeSuggestionIndex = Math.max(this.activeSuggestionIndex - 1, -1);
    } else if (event.key === 'Enter' && this.activeSuggestionIndex >= 0) {
      event.preventDefault();
      this.selectSuggestion(list[this.activeSuggestionIndex]);
      // Suggestion selected — do not add yet, user still needs to enter quantity
    } else if (event.key === 'Enter' && this.activeSuggestionIndex < 0 && list.length === 0) {
      this.addIngredient();
    } else if (event.key === 'Escape') {
      this.suggestions.set([]);
      this.activeSuggestionIndex = -1;
    }
  }

  /** Strips digits from the name field and updates the autocomplete suggestions. */
  onNameInput(): void {
    this.name = this.name.replace(/\d/g, '');
    this.notInListError = false;
    this.syncUnit();
    this.activeSuggestionIndex = -1;
    const q = this.name.trim().toLowerCase();
    if (q.length < 1) { this.suggestions.set([]); return; }
    const existing = new Set(this.ingredients().map(i => i.name.toLowerCase()));
    this.suggestions.set(
      this.allIngredients().filter(i => i.toLowerCase().startsWith(q) && !existing.has(i.toLowerCase())).slice(0, 5)
    );
  }

  /** Fills the name field with the selected suggestion and closes the list. */
  selectSuggestion(name: string): void {
    this.name = name;
    this.notInListError = false;
    this.syncUnit();
    this.suggestions.set([]);
    this.activeSuggestionIndex = -1;
  }

  /** Hides the suggestion list after a short delay to allow click events to fire. */
  hideSuggestions(): void {
    setTimeout(() => this.suggestions.set([]), 150);
  }

  /** Adds or updates an ingredient */
  addIngredient(): void {
    const trimmed = this.name.trim();
    this.nameError = !trimmed;
    this.notInListError = !!trimmed && !isLikelyIngredient(trimmed);
    this.amountError = !this.amount || this.amount < 1;
    if (this.nameError || this.notInListError || this.amountError) return;

    // If not in the known list, persist to Firestore so all users see it next time
    const known = this.allIngredients().some(i => i.toLowerCase() === trimmed.toLowerCase());
    if (!known) {
      this.customService.add(trimmed);
    }

    this.suggestions.set([]);
    let updated: Ingredient[];
    if (this.editIndex !== null) {
      updated = this.ingredients().map((ing, i) =>
        i === this.editIndex ? { name: trimmed, amount: this.amount, unit: this.unit } : ing
      );
      this.editIndex = null;
    } else {
      updated = [...this.ingredients(), { name: trimmed, amount: this.amount, unit: this.unit }];
    }
    this.ingredients.set(updated);
    this.ingredientsChange.emit(updated);
    this.name = '';
    this.amount = 100;
    this.nameError = false;
    this.notInListError = false;
    this.amountError = false;
  }

  /** Removes ingredient at the given index from the list */
  removeIngredient(index: number): void {
    if (this.editIndex === index) this.editIndex = null;
    const updated = this.ingredients().filter((_, i) => i !== index);
    this.ingredients.set(updated);
    this.ingredientsChange.emit(updated);
  }

  /** Loads an ingredient into the form fields for editing (item stays in list until saved) */
  startEdit(index: number): void {
    const ing = this.ingredients()[index];
    this.name = ing.name;
    this.amount = ing.amount;
    this.unit = ing.unit;
    this.editIndex = index;
    this.nameError = false;
    this.notInListError = false;
    this.amountError = false;
  }

  /** Cancels an ongoing edit and resets the form */
  cancelEdit(): void {
    this.editIndex = null;
    this.name = '';
    this.amount = 100;
    this.unit = 'g';
    this.nameError = false;
    this.notInListError = false;
    this.amountError = false;
    this.suggestions.set([]);
  }
}
