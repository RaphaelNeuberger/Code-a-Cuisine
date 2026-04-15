import { Injectable, EnvironmentInjector, inject, runInInjectionContext, signal } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, arrayUnion } from '@angular/fire/firestore';

const CONFIG_PATH = 'config/ingredients';

/** Manages the shared custom ingredient list stored in Firestore. */
@Injectable({ providedIn: 'root' })
export class CustomIngredientsService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);

  readonly list = signal<string[]>([]);
  private loaded = false;

  /** Loads the custom ingredient list from Firestore once. Safe to call multiple times. */
  async load(): Promise<void> {
    if (this.loaded) return;
    try {
      const ref = runInInjectionContext(this.injector, () => doc(this.firestore, CONFIG_PATH));
      const snap = await runInInjectionContext(this.injector, () => getDoc(ref));
      if (snap.exists()) {
        this.list.set((snap.data()['list'] as string[]) ?? []);
      }
      this.loaded = true;
    } catch { /* network errors are non-fatal */ }
  }

  /** Adds a new ingredient to Firestore and updates the local signal. No-op if already present. */
  async add(name: string): Promise<void> {
    if (this.list().some(i => i.toLowerCase() === name.toLowerCase())) return;
    try {
      const ref = runInInjectionContext(this.injector, () => doc(this.firestore, CONFIG_PATH));
      await runInInjectionContext(this.injector, () => setDoc(ref, { list: arrayUnion(name) }, { merge: true }));
      this.list.update(l => [...l, name]);
    } catch { /* silently ignore write errors */ }
  }
}
