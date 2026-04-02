import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { RecipeService, RecipeFilter } from '../../shared/services/recipe.service';
import { RecipeCard } from '../../shared/components/recipe-card/recipe-card';
import { Tag } from '../../shared/components/tag/tag';
import { Recipe, CuisineType, DietType, ComplexityType } from '../../shared/models/recipe.model';

const CUISINES: { value: CuisineType; label: string; emoji: string; img: string }[] = [
  { value: 'italian',  label: 'Italian cuisine',  emoji: '🍝', img: 'assets/cuisine/italian.jpg' },
  { value: 'german',   label: 'German cuisine',   emoji: '🥨', img: 'assets/cuisine/german.jpg' },
  { value: 'japanese', label: 'Japanese cuisine', emoji: '🥢', img: 'assets/cuisine/japanese.jpg' },
  { value: 'indian',   label: 'Indian cuisine',   emoji: '🍛', img: 'assets/cuisine/indian.jpg' },
  { value: 'gourmet',  label: 'Gourmet cuisine',  emoji: '✨', img: 'assets/cuisine/gourmet.jpg' },
  { value: 'fusion',   label: 'Fusion cuisine',   emoji: '🍢', img: 'assets/cuisine/fusion.jpg' }
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
  readonly hasMore = signal<boolean>(false);
  readonly isLoadingMore = signal<boolean>(false);

  private lastSnap: DocumentSnapshot | undefined;

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
    this.loadRecipes();
  }

  /** Applies the given diet filter and reloads recipes */
  filterByDiet(diet: DietType): void {
    this.selectedDiet = this.selectedDiet === diet ? undefined : diet;
    this.loadRecipes();
  }

  /** Applies the given complexity filter and reloads recipes */
  filterByComplexity(complexity: ComplexityType): void {
    this.selectedComplexity = this.selectedComplexity === complexity ? undefined : complexity;
    this.loadRecipes();
  }

  /** Loads next page and appends to existing list */
  loadMore(): void {
    if (this.isLoadingMore()) return;
    this.isLoadingMore.set(true);
    this.recipeService.getRecipePage(this.activeFilter(), this.lastSnap).subscribe(({ recipes, lastSnap }) => {
      this.allRecipes.update(prev => [...prev, ...recipes]);
      this.lastSnap = lastSnap;
      this.hasMore.set(recipes.length === 20);
      this.isLoadingMore.set(false);
    });
  }

  /** Resets and loads the first page of recipes with current filters */
  private loadRecipes(): void {
    this.lastSnap = undefined;
    this.recipeService.getRecipePage(this.activeFilter()).subscribe(({ recipes, lastSnap }) => {
      this.allRecipes.set(recipes);
      this.lastSnap = lastSnap;
      this.hasMore.set(recipes.length === 20);
    });
  }

  /** Builds the current filter object */
  private activeFilter(): RecipeFilter {
    const filter: RecipeFilter = {};
    if (this.selectedCuisine) filter.cuisine = this.selectedCuisine;
    if (this.selectedDiet) filter.diet = this.selectedDiet;
    if (this.selectedComplexity) filter.complexity = this.selectedComplexity;
    return filter;
  }
}
