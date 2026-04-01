import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeSuggestions } from './recipe-suggestions';

describe('RecipeSuggestions', () => {
  let component: RecipeSuggestions;
  let fixture: ComponentFixture<RecipeSuggestions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeSuggestions],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeSuggestions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
