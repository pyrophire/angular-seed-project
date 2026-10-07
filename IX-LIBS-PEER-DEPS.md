# Fixing the dependency declarations in `@pyrophire/ix-libs`

> **Resolved in 22.2.0.** The published package now declares only the peers it imports, no longer imports `lodash`, and no longer ships its own tarball. The seed is on 22.2.0 and the `lodash` stopgap has been removed. The rest of this document describes 22.1.5 and is kept for reference.

Written against `@pyrophire/ix-libs@22.1.5` as installed in this seed. I only had the published package, not the library's source repo, so file paths inside the library are inferred from a standard Angular library workspace (`projects/ix-libs/...`). Adjust to match.

## What is wrong

The published `package.json` declares this:

```json
"dependencies": { "tslib": "^2.3.1" },
"peerDependencies": {
  "@angular/animations": "^22.0.0",
  "@angular/cdk": "^22.0.0",
  "@angular/cli": "^22.0.0",
  "@angular/common": "^22.0.0",
  "@angular/compiler": "^22.0.0",
  "@angular/core": "^22.0.0",
  "@angular/forms": "^22.0.0",
  "@angular/material": "^22.0.0",
  "@angular/platform-browser": "^22.0.0",
  "@angular/platform-browser-dynamic": "^22.0.0",
  "@angular/router": "^22.0.0",
  "marked": "^18.0.10",
  "rxjs": "^7.8.0"
}
```

Compared with what the shipped bundle (`fesm2022/pyrophire-ix-libs.mjs`), the `ng-add` schematic, and the `ix-doc-manifest` script actually import:

| Package | Declared | Imported by the library | Verdict |
| --- | --- | --- | --- |
| `@angular/core`, `common`, `forms`, `router`, `platform-browser`, `cdk`, `material`, `rxjs`, `marked` | peer | yes | Correct |
| `@angular/animations` | peer | no | **Remove** |
| `@angular/platform-browser-dynamic` | peer | no | **Remove** |
| `@angular/compiler` | peer | no | **Remove** (only needed by apps, which already have it) |
| `@angular/cli` | peer | no | **Remove** (see the schematics note below) |
| `lodash` | not declared | yes, one call | **Missing** |

There are two separate problems here.

### 1. Four peers the library does not use

Every app that installs ix-libs is told it must also install `@angular/animations`, `@angular/platform-browser-dynamic`, `@angular/compiler`, and `@angular/cli` at v22. The first two are packages Angular itself is retiring: a zoneless, standalone app (like this seed now is) needs neither. With default npm settings they are installed anyway because ix-libs asks for them, and when Angular 23 ships, any app that has dropped them will hit `ERESOLVE` on install until ix-libs is republished.

### 2. `lodash` is imported but never declared

`IxTableComponent` does `import * as _ from 'lodash'` and calls `_.orderBy` once. Nothing in ix-libs' `package.json` mentions lodash, so it only works when some other package happens to bring lodash in.

This is not theoretical. In this seed lodash was arriving as a transitive dependency of Karma. Removing Karma broke the build:

```
✘ [ERROR] Could not resolve "lodash"
    node_modules/@pyrophire/ix-libs/fesm2022/pyrophire-ix-libs.mjs:15:19
```

I added `lodash` to the seed's own `dependencies` as a stopgap. It can come out once ix-libs is fixed.

It also causes the build warning `Module 'lodash' used by ... is not ESM`, because lodash is CommonJS. That is why `angular.json` needs `allowedCommonJsDependencies`.

### Why you have not seen install errors locally

Your `~/.npmrc` contains `legacy-peer-deps=true`. That tells npm to ignore peer dependencies completely: it neither installs them nor checks them. So on your machine the unused peers are invisible, while a build agent or a teammate without that setting gets different behaviour (extra packages installed, or a hard `ERESOLVE` failure). Fixing the declarations makes both environments behave the same.

## The fix

### Step 1: remove lodash from the library

One call does not justify a dependency. Replace it in `ix-table.component.ts`:

```ts
// before
import * as _ from 'lodash';
this.data = _.orderBy(this.data, this.activeSort.prop, this.activeSort.dir);
```

```ts
// after: no import
this.data = sortByProperty(this.data, this.activeSort.prop, this.activeSort.dir);
```

```ts
/**
 * Returns a sorted copy of the rows. Null and undefined values sort last in ascending order.
 *
 * @param rows - The rows to sort; not mutated
 * @param prop - The property to sort by
 * @param direction - Sort direction
 * @returns A new, sorted array
 */
export function sortByProperty<Row extends Record<string, unknown>>(rows: readonly Row[], prop: keyof Row, direction: 'asc' | 'desc'): Row[] {
    const factor = direction === 'desc' ? -1 : 1;
    return [...rows].sort((a, b) => {
        const left = a[prop];
        const right = b[prop];
        if (left == null || right == null) {
            return left == null && right == null ? 0 : (left == null ? 1 : -1) * factor;
        }
        if (typeof left === 'number' && typeof right === 'number') {
            return (left - right) * factor;
        }
        return String(left).localeCompare(String(right), undefined, { numeric: true }) * factor;
    });
}
```

One behaviour difference to decide on: lodash compares strings by code unit (so `"Z"` sorts before `"a"`), while `localeCompare` sorts case-insensitively and treats `"item 10"` as after `"item 2"`. That is usually what a table wants, but it is a visible change. If you need the exact old order, compare with `<` / `>` instead of `localeCompare`.

If you would rather keep lodash, switch to `lodash-es` (ESM, tree-shakeable, no build warning), import only what is used, and declare it:

```ts
import { orderBy } from 'lodash-es';
```

```json
"dependencies": { "tslib": "^2.3.1", "lodash-es": "^4.17.21" }
```

Use `dependencies` here, not `peerDependencies`: it is an implementation detail the app never touches, so the app should not have to install it. For ng-packagr to accept a non-peer dependency, add it to the allow list in `projects/ix-libs/ng-package.json`:

```json
{ "allowedNonPeerDependencies": ["lodash-es"] }
```

### Step 2: correct the peer list

In the library's own `package.json` (`projects/ix-libs/package.json`, not the workspace root):

```json
"peerDependencies": {
  "@angular/cdk": "^22.0.0",
  "@angular/common": "^22.0.0",
  "@angular/core": "^22.0.0",
  "@angular/forms": "^22.0.0",
  "@angular/material": "^22.0.0",
  "@angular/platform-browser": "^22.0.0",
  "@angular/router": "^22.0.0",
  "marked": "^18.0.10",
  "rxjs": "^7.8.0"
},
"dependencies": {
  "tslib": "^2.3.1"
}
```

Rule of thumb: a package belongs in `peerDependencies` only if the library's published code imports it **and** the app must share the same instance (all of Angular, RxJS). Everything the library needs only to build or test itself belongs in the workspace root `devDependencies`, which are never published.

If `marked` is only used by the docs viewer and some apps do not use that feature, mark it optional so those apps are not forced to install it:

```json
"peerDependenciesMeta": { "marked": { "optional": true } }
```

Only do this if the docs viewer is reachable through a lazy import. A top-level `import { marked } from 'marked'` in the main bundle will fail to resolve in an app that skips it. In 22.1.5 the import is at the top of the single bundle, so today it must stay required.

### Step 3: schematics and the CLI peer

`@angular/cli` is most likely in the peer list because the package ships an `ng-add` schematic. It is not needed: a schematic is always run *by* the CLI, so the CLI is present by definition. What `schematics/ng-add/index.js` does require is `@angular-devkit/schematics`, which the CLI also provides at runtime. Angular's own guidance for library schematics is to declare nothing for it, so removing `@angular/cli` and adding nothing is correct.

### Step 4: stop shipping the tarball

The published package contains `pyrophire-ix-libs-22.1.5.tgz`, a copy of itself. That means `npm pack` was run inside the `dist` folder before publishing and the result was swept into the next pack. It is harmless but adds 80 kB to a 476 kB package. Either run `npm publish` directly from `dist/ix-libs` without packing first, or add a `.npmignore` containing `*.tgz` to the library project so it is copied into `dist`.

### Step 5: widen the range before Angular 23

`"^22.0.0"` rejects v23 the day it ships. Angular Material's own convention is to allow the next major:

```json
"@angular/core": "^22.0.0 || ^23.0.0"
```

Only do this if you intend to test against 23 prereleases. Otherwise keep `^22.0.0` and bump on each major as you do now.

## Verifying the fix

Run these in the library repo before publishing.

1. Build and inspect what will be published:

   ```bash
   ng build ix-libs
   cat dist/ix-libs/package.json
   npm pack --dry-run ./dist/ix-libs
   ```

   The peer list should match step 2 and no `.tgz` should be listed.

2. Confirm the bundle imports nothing undeclared:

   ```bash
   grep -ohE "from '[^.'][^']*'" dist/ix-libs/fesm2022/*.mjs | sort -u
   ```

   Every package printed must be in `peerDependencies` or `dependencies`. `lodash` must be gone.

3. Install into this seed with peer checking **on**, which is what CI sees:

   ```bash
   npm pack ./dist/ix-libs
   cd ../_CHANGEME
   npm install ../ix-libs/pyrophire-ix-libs-<version>.tgz --legacy-peer-deps=false
   npm ls
   ```

   `npm ls` should report nothing `missing` or `invalid` for ix-libs.

4. In this seed, remove the stopgaps and rebuild:

   - delete `lodash` from `dependencies` in `package.json`
   - delete `"allowedCommonJsDependencies": ["lodash"]` from `angular.json`
   - `npm install && npm run build && npm test`

   The build should finish with no "is not ESM" warning.

## Versioning

Removing peers is backwards compatible, so that part alone is a patch. Removing lodash changes sort order for mixed-case strings if you take the `localeCompare` route, so call it a minor (`22.2.0`) and note the sort change in the release notes.

## Related, in this seed rather than ix-libs

`npm ls` currently reports one unrelated invalid package: `@ngneat/overview` is installed at 5.1.1, but `@ngxpert/hot-toast@6` requires `>= 7.0.0`. It is declared twice in the seed's `package.json` (`6.1.1` in `dependencies`, `^5.1.1` in `devDependencies`). It should be a single entry at `^7`. I have not changed it, since dependency cleanup beyond what the modernization needed was not part of this pass.
