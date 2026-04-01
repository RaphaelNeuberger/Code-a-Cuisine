import { TestBed } from '@angular/core/testing';
import { RecipeStateService } from './recipe-state.service';
import { RecipeRequest } from '../models/request.model';
import { Recipe, CuisineType, DietType, ComplexityType } from '../models/recipe.model';

const mockRequest: RecipeRequest = {
  ingredients: [{ name: 'Pasta', amount: 100, unit: 'g' }],
  portions: 2,
  chefs: 1,
  complexity: 'quick' as ComplexityType,
  cuisine: 'italian' as CuisineType,
  diet: 'none' as DietType
};

const mockRecipe: Recipe = {
  title: 'Test Recipe',
  cookingTimeMinutes: 20,
  cuisine: 'italian',
  diet: 'none',
  complexity: 'quick',
  portions: 2,
  chefs: 1,
  ingredients: [],
  extraIngredients: [],
  steps: [],
  nutrition: { calories: 500, protein: 20, fat: 15, carbs: 60 },
  hearts: 0,
  createdAt: new Date()
};

describe('RecipeStateService', () => {
  let service: RecipeStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeStateService);
  });

  it('should start with null request', () => {
    expect(service.request()).toBeNull();
  });

  it('should update request signal via setRequest', () => {
    service.setRequest(mockRequest);
    expect(service.request()).toEqual(mockRequest);
  });

  it('should start with empty recipes array', () => {
    expect(service.recipes()).toEqual([]);
  });

  it('should update recipes signal via setRecipes', () => {
    service.setRecipes([mockRecipe]);
    expect(service.recipes()).toHaveLength(1);
    expect(service.recipes()[0].title).toBe('Test Recipe');
  });

  it('should start with isLoading false', () => {
    expect(service.isLoading()).toBe(false);
  });

  it('should toggle isLoading', () => {
    service.setLoading(true);
    expect(service.isLoading()).toBe(true);
  });
});
