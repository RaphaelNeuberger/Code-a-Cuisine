import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ingredients } from './ingredients';

describe('Ingredients', () => {
  let component: Ingredients;
  let fixture: ComponentFixture<Ingredients>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ingredients],
    }).compileComponents();

    fixture = TestBed.createComponent(Ingredients);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
