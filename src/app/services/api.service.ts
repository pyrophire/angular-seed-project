import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { TransactionResult } from '@models/transaction.model';
import { map } from 'rxjs/operators';
import { StoreService } from './store.service';
import { ToastService } from './util/toast.service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(
        private http: HttpClient,
        public store: StoreService,
        private toast: ToastService
    ) {}

    getItems() {
        return this.http.get(`${environment.baseUrl}/items`).pipe(
            map((res: TransactionResult<any>) => {
                if (res.success === false) {
                    this.toast.error(res.message);
                } else {
                    this.store.items.set(res.results);
                    return res;
                }
            })
        );
    }

    addItem(item: any) {
        return this.http.post(`${environment.baseUrl}/items`, item).pipe(
            map((res: TransactionResult<any>) => {
                if (res.success === false) {
                    this.toast.error(res.message);
                } else {
                    this.store.items.update((items) => [...items, res.results]);
                    return res;
                }
            })
        );
    }
}
