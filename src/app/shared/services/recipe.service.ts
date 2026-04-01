import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, doc, addDoc, getDoc,
  getDocs, updateDoc, query, where, orderBy, limit,
  startAfter, DocumentSnapshot, increment, Timestamp,
  QueryConstraint
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { CuisineType, DietType, ComplexityType, Recipe } from '../models/recipe.model';

/** Filter options for querying the recipe library */
export interface RecipeFilter {
  cuisine?: CuisineType;
  diet?: DietType;
  complexity?: ComplexityType;
}

const COLLECTION = 'recipes';
const PAGE_SIZE = 20;

/** Handles all Firestore read/write operations for recipes */
@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly firestore = inject(Firestore);

  /**
   * Saves an array of recipes to Firestore and returns their new IDs.
   * @param recipes - array of recipes to persist
   */
  async saveRecipes(recipes: Recipe[]): Promise<string[]> {
    const col = collection(this.firestore, COLLECTION);
    const saves = recipes.map(r => addDoc(col, { ...r, createdAt: Timestamp.fromDate(r.createdAt) }));
    const refs = await Promise.all(saves);
    return refs.map(r => r.id);
  }

  /**
   * Loads a single recipe by Firestore document ID.
   * @param id - Firestore document ID
   */
  getRecipe(id: string): Observable<Recipe> {
    const ref = doc(this.firestore, COLLECTION, id);
    return from(getDoc(ref)).pipe(
      map(snap => ({ id: snap.id, ...snap.data(), createdAt: (snap.data()?.['createdAt'] as Timestamp).toDate() } as Recipe))
    );
  }

  /**
   * Returns all recipes matching the optional filter, paginated.
   * @param filter - optional cuisine/diet/complexity filter
   * @param lastDoc - last document from previous page for cursor pagination
   */
  getAllRecipes(filter: RecipeFilter = {}, lastDoc?: DocumentSnapshot): Observable<Recipe[]> {
    const col = collection(this.firestore, COLLECTION);
    const constraints: QueryConstraint[] = [];
    if (filter.cuisine) constraints.push(where('cuisine', '==', filter.cuisine));
    if (filter.diet) constraints.push(where('diet', '==', filter.diet));
    if (filter.complexity) constraints.push(where('complexity', '==', filter.complexity));
    constraints.push(orderBy('createdAt', 'desc'));
    constraints.push(limit(PAGE_SIZE));
    if (lastDoc) constraints.push(startAfter(lastDoc));
    const q = query(col, ...constraints);
    return from(getDocs(q)).pipe(
      map(snap => snap.docs.map(d => ({
        id: d.id, ...d.data(),
        createdAt: (d.data()['createdAt'] as Timestamp).toDate()
      } as Recipe)))
    );
  }

  /**
   * Returns the most liked recipes (top 10 by hearts).
   */
  getMostLiked(): Observable<Recipe[]> {
    const col = collection(this.firestore, COLLECTION);
    const q = query(col, orderBy('hearts', 'desc'), limit(10));
    return from(getDocs(q)).pipe(
      map(snap => snap.docs.map(d => ({
        id: d.id, ...d.data(),
        createdAt: (d.data()['createdAt'] as Timestamp).toDate()
      } as Recipe)))
    );
  }

  /**
   * Increments the heart counter for a recipe by 1.
   * @param id - Firestore document ID of the recipe
   */
  async incrementHearts(id: string): Promise<void> {
    const ref = doc(this.firestore, COLLECTION, id);
    await updateDoc(ref, { hearts: increment(1) });
  }
}
