import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    public readonly items = signal<unknown[]>([]);

    /**
     * Resets every piece of shared state to its initial value.
     */
    clearAll(): void {
        this.items.set([]);
    }
}
