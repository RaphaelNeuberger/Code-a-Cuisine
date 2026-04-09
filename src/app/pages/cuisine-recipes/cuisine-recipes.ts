import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RecipeService } from '../../shared/services/recipe.service';
import { Recipe, CuisineType } from '../../shared/models/recipe.model';
import { catchError, of } from 'rxjs';

const CUISINE_LABELS: Record<CuisineType, string> = {
  italian:  'Italian cuisine',
  german:   'German cuisine',
  japanese: 'Japanese cuisine',
  indian:   'Indian cuisine',
  gourmet:  'Gourmet cuisine',
  fusion:   'Fusion cuisine',
};

const CUISINE_HEROES: Record<CuisineType, string> = {
  italian:  'assets/cuisine/hero-italian.png',
  german:   'assets/cuisine/hero-german.png',
  japanese: 'assets/cuisine/hero-japanese.png',
  indian:   'assets/cuisine/hero-indian.png',
  gourmet:  'assets/cuisine/hero-gourmet.png',
  fusion:   'assets/cuisine/hero-fusion.png',
};

const PAGE_SIZE = 15;

/** Displays all recipes for a specific cuisine with client-side pagination */
@Component({
  selector: 'app-cuisine-recipes',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cuisine-recipes.html',
  styleUrl: './cuisine-recipes.scss'
})
export class CuisineRecipes implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly recipeService = inject(RecipeService);

  readonly cuisine = signal<CuisineType | null>(null);
  readonly allRecipes = signal<Recipe[]>([]);
  readonly currentPage = signal(1);
  readonly isLoading = signal(true);

  readonly totalPages = computed(() => Math.ceil(this.allRecipes().length / PAGE_SIZE));

  readonly recipes = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.allRecipes().slice(start, start + PAGE_SIZE);
  });

  readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push('...');
    if (total > 1) pages.push(total);
    return pages;
  });

  get cuisineLabel(): string {
    const c = this.cuisine();
    return c ? CUISINE_LABELS[c] : '';
  }

  get cuisineHero(): string {
    const c = this.cuisine();
    return c ? CUISINE_HEROES[c] : '';
  }

  ngOnInit(): void {
    const c = this.route.snapshot.paramMap.get('cuisine') as CuisineType;
    this.cuisine.set(c);
    this.recipeService.getAllRecipes({ cuisine: c }).pipe(
      catchError(err => { console.error('Cuisine query error:', err); return of([]); })
    ).subscribe(recipes => {
      this.allRecipes.set(recipes);
      this.isLoading.set(false);
    });
  }

  private readonly heartedIds = new Set<string>();

  isHearted(id: string): boolean {
    return this.heartedIds.has(id);
  }

  async heartRecipe(event: Event, id: string): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    if (this.heartedIds.has(id)) return;
    this.heartedIds.add(id);
    await this.recipeService.incrementHearts(id);
    this.allRecipes.update(recipes =>
      recipes.map(r => r.id === id ? { ...r, hearts: r.hearts + 1 } : r)
    );
  }

  goToPage(page: number | '...'): void {
    if (typeof page !== 'number') return;
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prev(): void {
    if (this.currentPage() > 1) this.goToPage(this.currentPage() - 1);
  }

  next(): void {
    if (this.currentPage() < this.totalPages()) this.goToPage(this.currentPage() + 1);
  }
}
