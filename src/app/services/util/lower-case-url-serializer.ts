import { DefaultUrlSerializer, UrlTree } from '@angular/router';

/**
 * Makes routes case-insensitive by lower-casing every incoming URL.
 *
 * Not registered by default. To enable it, add to `app.config.ts`:
 * `{ provide: UrlSerializer, useClass: LowerCaseUrlSerializer }`
 */
export class LowerCaseUrlSerializer extends DefaultUrlSerializer {
    /**
     * @param url - The URL to parse
     * @returns The parsed tree of the lower-cased URL
     */
    override parse(url: string): UrlTree {
        return super.parse(url.toLowerCase());
    }
}
