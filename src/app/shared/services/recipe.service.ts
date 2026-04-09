import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
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
  private readonly injector = inject(EnvironmentInjector);

  /**
   * Saves an array of recipes to Firestore and returns their new IDs.
   * @param recipes - array of recipes to persist
   */
  async saveRecipes(recipes: Recipe[]): Promise<string[]> {
    return runInInjectionContext(this.injector, async () => {
      const col = collection(this.firestore, COLLECTION);
      const saves = recipes.map(r => addDoc(col, { ...r, createdAt: Timestamp.fromDate(r.createdAt) }));
      const refs = await Promise.all(saves);
      return refs.map(r => r.id);
    });
  }

  /**
   * Loads a single recipe by Firestore document ID.
   * @param id - Firestore document ID
   */
  getRecipe(id: string): Observable<Recipe> {
    return runInInjectionContext(this.injector, () => {
      const ref = doc(this.firestore, COLLECTION, id);
      return from(getDoc(ref)).pipe(
        map(snap => {
        const data = snap.data();
        const createdAt = data?.['createdAt'] instanceof Timestamp
          ? data['createdAt'].toDate()
          : new Date(data?.['createdAt'] ?? Date.now());
        return { id: snap.id, ...data, createdAt } as Recipe;
      })
      );
    });
  }

  /**
   * Returns all recipes matching the optional filter, paginated.
   * @param filter - optional cuisine/diet/complexity filter
   * @param lastDoc - last document from previous page for cursor pagination
   */
  getAllRecipes(filter: RecipeFilter = {}, lastDoc?: DocumentSnapshot): Observable<Recipe[]> {
    return this.getRecipePage(filter, lastDoc).pipe(map(r => r.recipes));
  }

  /**
   * Returns a page of recipes together with the last DocumentSnapshot for cursor pagination.
   * @param filter - optional cuisine/diet/complexity filter
   * @param lastDoc - last document from previous page for cursor pagination
   */
  getRecipePage(filter: RecipeFilter = {}, lastDoc?: DocumentSnapshot): Observable<{ recipes: Recipe[]; lastSnap: DocumentSnapshot | undefined }> {
    return runInInjectionContext(this.injector, () => {
      const col = collection(this.firestore, COLLECTION);
      const constraints: QueryConstraint[] = [];
      if (filter.cuisine) constraints.push(where('cuisine', '==', filter.cuisine));
      if (filter.diet) constraints.push(where('diet', '==', filter.diet));
      if (filter.complexity) constraints.push(where('complexity', '==', filter.complexity));
      const hasFilter = filter.cuisine || filter.diet || filter.complexity;
      if (!hasFilter) constraints.push(orderBy('createdAt', 'desc'));
      constraints.push(limit(PAGE_SIZE));
      if (lastDoc) constraints.push(startAfter(lastDoc));
      const q = query(col, ...constraints);
      return from(getDocs(q)).pipe(
        map(snap => ({
          recipes: snap.docs.map(d => {
            const data = d.data();
            const createdAt = data['createdAt'] instanceof Timestamp
              ? data['createdAt'].toDate()
              : new Date(data['createdAt'] ?? Date.now());
            return { id: d.id, ...data, createdAt } as Recipe;
          }),
          lastSnap: snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : undefined
        }))
      );
    });
  }

  /**
   * Returns the most liked recipes (top 10 by hearts).
   */
  getMostLiked(): Observable<Recipe[]> {
    return runInInjectionContext(this.injector, () => {
      const col = collection(this.firestore, COLLECTION);
      const q = query(col, orderBy('hearts', 'desc'), limit(10));
      return from(getDocs(q)).pipe(
        map(snap => snap.docs.map(d => {
          const data = d.data();
          const createdAt = data['createdAt'] instanceof Timestamp
            ? data['createdAt'].toDate()
            : new Date(data['createdAt'] ?? Date.now());
          return { id: d.id, ...data, createdAt } as Recipe;
        }))
      );
    });
  }

  /**
   * Increments the heart counter for a recipe by 1.
   * @param id - Firestore document ID of the recipe
   */
  async incrementHearts(id: string): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      const ref = doc(this.firestore, COLLECTION, id);
      await updateDoc(ref, { hearts: increment(1) });
    });
  }
}
