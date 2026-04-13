import { Component, OnInit, inject, signal, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { RecipeService, RecipeFilter } from '../../shared/services/recipe.service';
import { Recipe, CuisineType, DietType, ComplexityType } from '../../shared/models/recipe.model';

const CUISINES: { value: CuisineType; label: string; emoji: string; img: string }[] = [
  { value: 'italian',  label: 'Italian cuisine',  emoji: '🤌', img: 'assets/cuisine/italian.png' },
  { value: 'german',   label: 'German cuisine',   emoji: '🥨', img: 'assets/cuisine/german.png' },
  { value: 'japanese', label: 'Japanese cuisine', emoji: '🥢', img: 'assets/cuisine/japanese.png' },
  { value: 'indian',   label: 'Indian cuisine',   emoji: '✨', img: 'assets/cuisine/indian.png' },
  { value: 'gourmet',  label: 'Gourmet cuisine',  emoji: '🍛', img: 'assets/cuisine/gourmet.png' },
  { value: 'fusion',   label: 'Fusion cuisine',   emoji: '🍢', img: 'assets/cuisine/fusion.png' }
];

/** Cookbook library — shows cuisine categories, most liked, and filterable recipe grid */
@Component({
  selector: 'app-recipe-library',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './recipe-library.html',
  styleUrl: './recipe-library.scss'
})
export class RecipeLibrary implements OnInit {
  private readonly recipeService = inject(RecipeService);
  private readonly location = inject(Location);
  private readonly host = inject(ElementRef);

  readonly cuisineCategories = CUISINES;
  readonly allRecipes = signal<Recipe[]>([]);
  readonly mostLiked = signal<Recipe[]>([]);
  readonly hasMore = signal<boolean>(false);
  readonly isLoadingMore = signal<boolean>(false);

  private lastSnap: DocumentSnapshot | undefined;

  readonly dietOptions: { value: DietType; label: string }[] = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'keto', label: 'Keto' },
    { value: 'none', label: 'All' }
  ];

  readonly complexityOptions: { value: ComplexityType; label: string }[] = [
    { value: 'quick', label: 'Quick' },
    { value: 'medium', label: 'Medium' },
    { value: 'complex', label: 'Complex' }
  ];

  selectedCuisine: CuisineType | undefined;
  selectedDiet: DietType | undefined;
  selectedComplexity: ComplexityType | undefined;

  /** Navigates back to the previous page. */
  goBack(): void { this.location.back(); }

  private drag: { x: number; scrollLeft: number } | null = null;

  /** Begins mouse-drag scroll on the most-liked carousel. */
  dragStart(e: MouseEvent): void {
    const el = e.currentTarget as HTMLElement;
    this.drag = { x: e.pageX, scrollLeft: el.scrollLeft };
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
  }

  /** Scrolls the carousel while dragging. */
  dragMove(e: MouseEvent): void {
    if (!this.drag) return;
    e.preventDefault();
    const el = e.currentTarget as HTMLElement;
    el.scrollLeft = this.drag.scrollLeft - (e.pageX - this.drag.x);
  }

  /** Ends the drag scroll and resets the cursor. */
  dragEnd(e?: MouseEvent): void {
    if (!this.drag) return;
    this.drag = null;
    const el = (e?.currentTarget ?? this.host.nativeElement.querySelector('.library__most-liked-list')) as HTMLElement | null;
    if (el) { el.style.cursor = 'grab'; el.style.userSelect = ''; }
  }

  /** Loads the most-liked recipes on init. */
  ngOnInit(): void {
    this.recipeService.getMostLiked().subscribe(r => this.mostLiked.set(r));
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
