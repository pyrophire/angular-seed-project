import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ParamBuilderService {
    /**
     * Builds a query string from an object, skipping null, undefined, and blank values.
     * Keys and values are URL-encoded.
     *
     * @param params - The values to serialize
     * @returns The query string without a leading `?`
     *
     * @example
     * buildParams({ name: 'a b', page: 2, empty: '' }); // 'name=a%20b&page=2'
     */
    buildParams(params: Record<string, string | number | boolean | null | undefined>): string {
        return Object.entries(params)
            .filter(([, value]) => value !== null && value !== undefined && String(value).trim().length > 0)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
            .join('&');
    }
}
