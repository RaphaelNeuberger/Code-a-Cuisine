import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { N8nService } from './n8n.service';
import { RecipeRequest } from '../models/request.model';
import { Recipe } from '../models/recipe.model';

const mockRequest: RecipeRequest = {
  ingredients: [{ name: 'Pasta', amount: 100, unit: 'g' }],
  portions: 2, chefs: 1, complexity: 'quick', cuisine: 'italian', diet: 'none'
};

const mockApiResponse = {
  recipes: [{
    title: 'Pasta Dish',
    cookingTimeMinutes: 20,
    cuisine: 'italian',
    diet: 'none',
    complexity: 'quick',
    portions: 2,
    chefs: 1,
    ingredients: [{ name: 'Pasta', amount: 100, unit: 'g' }],
    extraIngredients: [],
    steps: [{ stepNumber: 1, title: 'Cook', description: 'Cook pasta' }],
    nutrition: { calories: 500, protein: 20, fat: 10, carbs: 70 },
    hearts: 0,
    createdAt: new Date().toISOString()
  }]
};

describe('N8nService', () => {
  let service: N8nService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(N8nService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should POST to webhook and return Recipe[]', async () => {
    const promise = lastValueFrom(service.generateRecipes(mockRequest));

    const req = httpMock.expectOne(r => r.url.includes('webhook'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockApiResponse);

    const recipes: Recipe[] = await promise;
    expect(recipes).toHaveLength(1);
    expect(recipes[0].title).toBe('Pasta Dish');
  });

  it('should return user-friendly message on HTTP 429', async () => {
    const promise = lastValueFrom(service.generateRecipes(mockRequest));

    const req = httpMock.expectOne(r => r.url.includes('webhook'));
    req.flush('Too Many Requests', { status: 429, statusText: 'Too Many Requests' });

    await expect(promise).rejects.toThrow('Tägliches Limit');
  });
});
