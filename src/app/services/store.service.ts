import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    public items = signal<any>([]);

    constructor() {}

    clearAll() {
        this.items.set([]);
    }
}
