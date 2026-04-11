import { Component, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ingredient } from '../../models/recipe.model';

const UNITS = ['g', 'ml', 'Stück', 'TL', 'EL', 'Tasse'];

const INGREDIENTS = [
  // A
  'Äpfel', 'Apfelsaft', 'Apfelmus', 'Aprikosen', 'Artischocken', 'Aubergine', 'Avocado', 'Ananas',
  // B
  'Bacon', 'Bananen', 'Basilikum', 'Blaubeeren', 'Blumenkohl', 'Bohnen', 'Brokkoli', 'Butter',
  'Buttermilch', 'Birnen', 'Brot', 'Brötchen', 'Bulgur',
  // C
  'Champignons', 'Chili', 'Chorizo', 'Cranberries', 'Creme fraîche',
  // D
  'Datteln', 'Dill',
  // E
  'Eier', 'Erbsen', 'Erdnüsse', 'Erdnussbutter', 'Erdbeeren', 'Edamame',
  // F
  'Feta', 'Fisch', 'Feldsalat', 'Fenchel', 'Forelle',
  // G
  'Garnelen', 'Gouda', 'Grapefruits', 'Grünkohl', 'Gurke',
  // H
  'Hackfleisch', 'Hähnchen', 'Haferflocken', 'Himbeeren', 'Honig', 'Harissa',
  // I
  'Ingwer',
  // J
  'Joghurt', 'Jakobsmuscheln',
  // K
  'Kabeljau', 'Karotten', 'Kartoffeln', 'Kirschen', 'Knoblauch', 'Koriander', 'Kürbis',
  'Kichererbsen', 'Kokoscreme', 'Kokosmilch', 'Kohl', 'Käse', 'Kürbiskerne', 'Kastanien',
  'Kerne', 'Kokosraspeln', 'Kreuzkümmel',
  // L
  'Lachs', 'Lauch', 'Limette', 'Linsen', 'Lammfleisch', 'Lavendel',
  // M
  'Mais', 'Mandeln', 'Mango', 'Mehl', 'Milch', 'Mozzarella', 'Makrele',
  'Majoran', 'Minze', 'Mascarpone', 'Mozarella', 'Miesmuscheln', 'Macadamia',
  'Mohnsamen', 'Maiskeimöl',
  // N
  'Nudeln', 'Nüsse', 'Nussmus', 'Nussmix',
  // O
  'Olivenöl', 'Orangen', 'Oregano',
  // P
  'Paprika', 'Parmesan', 'Pasta', 'Pfirsiche', 'Pilze', 'Putenfleisch',
  'Petersilie', 'Pflaume', 'Physalis', 'Pinienkerne', 'Polenta', 'Porree',
  'Paranüsse', 'Pistazien', 'Pekanüsse', 'Pekannüsse', 'Papayasamen',
  // Q
  'Quinoa',
  // R
  'Reis', 'Rindfleisch', 'Rosenkohl', 'Rote Bete', 'Rosmarin', 'Rucola',
  'Rote Linsen', 'Räucherlachs',
  // S
  'Sahne', 'Salami', 'Sellerie', 'Spinat', 'Speck', 'Sauerrahm',
  'Sauerkirschen', 'Schalotten', 'Schinken', 'Schnittlauch', 'Schwarzwälder Schinken',
  'Seitan', 'Sesam', 'Sesamöl', 'Sesamsamen', 'Sojasoße', 'Sonnenblumenkerne',
  'Sonnenblumenöl', 'Süßkartoffeln', 'Schwarzkümmel', 'Spelzweizen',
  // T
  'Thunfisch', 'Tofu', 'Tomaten', 'Thymian', 'Tamarinde',
  'Tempeh', 'Tomatenmark', 'Truthahn',
  // U
  'Udon-Nudeln',
  // W
  'Weintrauben', 'Weißwein', 'Walnüsse', 'Wasabi', 'Wirsing',
  'Weizenkleie', 'Weizenkörner', 'Weizenvollkornmehl',
  // Z
  'Zitrone', 'Zucchini', 'Zucker', 'Zwiebeln', 'Ziegenkäse',
];

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
  readonly suggestions = signal<string[]>([]);

  name = '';
  amount = 100;
  unit = 'g';
  editIndex: number | null = null;

  onNameInput(): void {
    const q = this.name.trim().toLowerCase();
    if (q.length < 1) { this.suggestions.set([]); return; }
    const existing = new Set(this.ingredients().map(i => i.name.toLowerCase()));
    this.suggestions.set(
      INGREDIENTS.filter(i => i.toLowerCase().startsWith(q) && !existing.has(i.toLowerCase())).slice(0, 5)
    );
  }

  selectSuggestion(name: string): void {
    this.name = name;
    this.suggestions.set([]);
  }

  hideSuggestions(): void {
    setTimeout(() => this.suggestions.set([]), 150);
  }

  /** Adds or updates an ingredient */
  addIngredient(): void {
    if (!this.name.trim()) return;
    this.suggestions.set([]);
    let updated: Ingredient[];
    if (this.editIndex !== null) {
      updated = this.ingredients().map((ing, i) =>
        i === this.editIndex ? { name: this.name.trim(), amount: this.amount, unit: this.unit } : ing
      );
      this.editIndex = null;
    } else {
      updated = [...this.ingredients(), { name: this.name.trim(), amount: this.amount, unit: this.unit }];
    }
    this.ingredients.set(updated);
    this.ingredientsChange.emit(updated);
    this.name = '';
    this.amount = 100;
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
  }
}
