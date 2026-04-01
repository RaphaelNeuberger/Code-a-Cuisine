import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecipeService, RecipeFilter } from '../../shared/services/recipe.service';
import { RecipeCard } from '../../shared/components/recipe-card/recipe-card';
import { Tag } from '../../shared/components/tag/tag';
import { Recipe, CuisineType, DietType, ComplexityType } from '../../shared/models/recipe.model';

const CUISINES: { value: CuisineType; label: string; emoji: string }[] = [
  { value: 'italian', label: 'Italian cuisine', emoji: '🍝' },
  { value: 'german', label: 'German cuisine', emoji: '🥨' },
  { value: 'japanese', label: 'Japanese cuisine', emoji: '🥢' },
  { value: 'indian', label: 'Indian cuisine', emoji: '🍛' },
  { value: 'gourmet', label: 'Gourmet cuisine', emoji: '✨' },
  { value: 'fusion', label: 'Fusion cuisine', emoji: '🍢' }
];

/** Cookbook library — shows cuisine categories, most liked, and filterable recipe grid */
@Component({
  selector: 'app-recipe-library',
  standalone: true,
  imports: [RouterLink, RecipeCard, Tag],
  templateUrl: './recipe-library.html',
  styleUrl: './recipe-library.scss'
})
export class RecipeLibrary implements OnInit {
  private readonly recipeService = inject(RecipeService);

  readonly cuisineCategories = CUISINES;
  readonly allRecipes = signal<Recipe[]>([]);
  readonly mostLiked = signal<Recipe[]>([]);
  readonly currentPage = signal<number>(1);

  readonly dietOptions: { value: DietType; label: string }[] = [
    { value: 'vegetarian', label: 'Vegetarisch' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'keto', label: 'Keto' },
    { value: 'none', label: 'Alle' }
  ];

  readonly complexityOptions: { value: ComplexityType; label: string }[] = [
    { value: 'quick', label: 'Schnell' },
    { value: 'medium', label: 'Mittel' },
    { value: 'complex', label: 'Aufwendig' }
  ];

  selectedCuisine: CuisineType | undefined;
  selectedDiet: DietType | undefined;
  selectedComplexity: ComplexityType | undefined;

  ngOnInit(): void {
    this.loadRecipes();
    this.recipeService.getMostLiked().subscribe(r => this.mostLiked.set(r));
  }

  /** Applies the given cuisine filter and reloads recipes */
  filterByCuisine(cuisine: CuisineType): void {
    this.selectedCuisine = this.selectedCuisine === cuisine ? undefined : cuisine;
    this.currentPage.set(1);
    this.loadRecipes();
  }

  /** Applies the given diet filter and reloads recipes */
  filterByDiet(diet: DietType): void {
    this.selectedDiet = this.selectedDiet === diet ? undefined : diet;
    this.currentPage.set(1);
    this.loadRecipes();
  }

  /** Applies the given complexity filter and reloads recipes */
  filterByComplexity(complexity: ComplexityType): void {
    this.selectedComplexity = this.selectedComplexity === complexity ? undefined : complexity;
    this.currentPage.set(1);
    this.loadRecipes();
  }

  /** Loads filtered recipes from Firestore */
  private loadRecipes(): void {
    const filter: RecipeFilter = {};
    if (this.selectedCuisine) filter.cuisine = this.selectedCuisine;
    if (this.selectedDiet) filter.diet = this.selectedDiet;
    if (this.selectedComplexity) filter.complexity = this.selectedComplexity;
    this.recipeService.getAllRecipes(filter).subscribe(r => this.allRecipes.set(r));
  }
}
