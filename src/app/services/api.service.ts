import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { TransactionResult } from '@models/transaction.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StoreService } from './store.service';
import { ToastService } from './util/toast.service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly http = inject(HttpClient);
    private readonly toast = inject(ToastService);
    public readonly store = inject(StoreService);

    /**
     * Loads all items into the store. A transaction that reports failure shows a toast and leaves the store untouched.
     *
     * @returns The transaction result as sent by the API
     */
    getItems(): Observable<TransactionResult<unknown[]>> {
        return this.http.get<TransactionResult<unknown[]>>(`${environment.baseUrl}/items`).pipe(
            tap((res) => {
                if (res.success === false) {
                    this.toast.error(res.message);
                } else {
                    this.store.items.set(res.results);
                }
            })
        );
    }

    /**
     * Creates an item and appends it to the store. A transaction that reports failure shows a toast and leaves the store untouched.
     *
     * @param item - The item to create
     * @returns The transaction result as sent by the API
     */
    addItem(item: unknown): Observable<TransactionResult<unknown>> {
        return this.http.post<TransactionResult<unknown>>(`${environment.baseUrl}/items`, item).pipe(
            tap((res) => {
                if (res.success === false) {
                    this.toast.error(res.message);
                } else {
                    this.store.items.update((items) => [...items, res.results]);
                }
            })
        );
    }
}
