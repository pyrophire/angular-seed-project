# CLAUDE.md — changeme

Angular 22.x SPA frontend. Zoneless with `OnPush` change detection as the framework default.

## Architecture

- App shell (`<router-outlet>` plus any app-wide chrome): `src/app/app.component.ts`, selector `changeme-root`.
- Routes: `src/app/app.routes.ts`. All feature screens are lazy-loaded.
- Presentational components: `src/app/components/**`.
- HTTP/backend access: `src/app/services/**`.
- Mock fixtures: `src/app/mocks/**`.
- Backend base URL comes from `environment.ts`; build request URLs in one helper rather than concatenating strings in
  each service. Use `proxy.conf.json` for relative `/api` calls during local development.

**How each feature works belongs in [`docs/claude/architecture.md`](docs/claude/architecture.md): read the section for
a feature before you change it**, and update that section in the same change. Add a section when you add a feature.

- **A feature that should be kept back** gets an app-wide switch (a feature-settings service backed by the API), not an
  environment flag, and every way into it is gated on that same switch.
- **Staff-only screens are kept out of the user docs** and get no links from reader-facing screens beyond their own
  nav entry.

## Conventions

- Use `inject()` for dependency injection — never constructor injection.
- Use `signal()`/`computed()` for reactive state — prefer over manual RxJS subscriptions.
- Services use the `@Service()` decorator (the v22 CLI default). Fall back to `@Injectable()` only for cases it doesn't
  cover, such as `providedIn: 'platform'`. `@Service()` forbids constructor injection outright.
- Templates use built-in control flow — `@if` / `@for` / `@switch`, never `*ngIf` / `*ngFor` / `NgSwitch`. Every `@for`
  needs a `track` expression.
- Component inputs and outputs are signal-based: `input()`, `input.required()`, `output()`, `model()` — not `@Input()` /
  `@Output()` decorators.
- Do **not** declare `changeDetection` on components; `OnPush` is already the default. Anything driven by a manual
  subscription will not refresh the view on its own — use signals, or `markForCheck()` if a subscription is
  unavoidable.
- The app is zoneless. No `zone.js`-era patterns, no `NgZone.run` workarounds.
  - Corollary, and the one that actually bites: **async work that mutates template-bound state from outside
    Angular does not repaint on its own.** Raw `addEventListener` handlers, `setInterval`/`setTimeout`
    callbacks and third-party library event hooks reach the view through nothing that marks it dirty.
    The symptom is a value that looks frozen until you click elsewhere.
  - **Hold that state in a `signal()` and the problem disappears** — writing a signal notifies its
    consumers and schedules change detection by itself, from a timer or a raw listener just the same.
    This is the fix, not `detectChanges()`.
  - **Reaching for `detectChanges()` almost always means you found a plain field that should be a signal.**
    Convert the field. The one legitimate exception is a *synchronous read-after-write of the DOM* — signals
    **schedule** change detection, they do not run it, so a template block that must be rendered before you
    query it needs forcing. Prefer `afterNextRender()` for that in new code.
  - **In-place mutation defeats all of this.** `arr.push(x)`, `set.add(x)` and `obj.field = x` on anything
    held in or reached through a signal leave the reference unchanged, so nothing notifies. Use
    `.update((a) => [...a, x])` and replace objects rather than patching them.
- Style components with `.scss` files only — never inline styles or plain `.css`.
- Co-locate each component's `*.component.ts`, `.html`, `.scss`, `.spec.ts`.
- **One component per folder**, named after it (`user-card/user-card.component.*`). A second component never joins an
  existing component's folder: give it a sibling folder, or a subfolder when it belongs only to its parent. A folder
  may group component folders (`users/browse/`) but then holds no component files of its own. Directives get their own
  folder the same way.

## Styling and view encapsulation

**Every component uses `encapsulation: ViewEncapsulation.None`.** This is a deliberate house standard, not debt — do
not "fix" components back to emulated encapsulation. It is what lets components override Material's own `--mat-*`
component tokens without `::ng-deep`. Set it as the schematics default in `angular.json`, so `ng g c` produces it
automatically.

Two rules follow from it, both non-optional:

1. **Never use `:host`.** Under `None`, Angular does not rewrite `:host`, and `:host` matches nothing
   outside shadow DOM — the rule is **silently dropped**, with no error and no warning. A component that
   relied on `:host { display: block }` will quietly fall back to `display: inline`. Use the element
   selector instead, with a comment so it is not "tidied" back:

   ```scss
   /* element selector, not :host — this component uses ViewEncapsulation.None */
   changeme-user-card { display: block; }
   ```

2. **Class names must be BEM or screen-prefixed.** `None` puts every component's CSS in one global
   namespace, so there is no collision safety net. `.card`, `.row`, `.header` are unsafe on their own;
   `.user-card__title` and `.settings-page__section` are fine. Stylesheet injection order follows
   route load order, so two same-specificity rules resolve by whichever screen loaded last — which is a
   heisenbug, not a style preference.

Build the theme with `use-system-variables: true`, so Material components read their colours from the `--mat-sys-*`
tokens at runtime. Runtime theme switches (e.g. a primary-colour picker) then work by putting a class such as
`changeme-primary--<name>` on `<html>` and swapping only the affected colour roles for it.

Colour comes from the Material 3 system tokens (`--mat-sys-*`), never hardcoded hex. **Check the token actually has a
value in both themes before relying on it** — some `--mat-sys-surface-*` tokens can be emitted empty.

## Standalone-first

- Standalone components and standalone imports only.
- Compose via component `imports: [...]`. Do not introduce or expand NgModules unless explicitly requested.
- The app contains **no application NgModule**, and does not need one. Importing Angular/Material's own library
  modules (`MatButtonModule`, `FormsModule`, …) into a standalone component's `imports` is normal and is not an
  exception to this rule.
- **DI-based class interceptors work without a module** — via `provideHttpClient(withInterceptorsFromDi())` in
  `app.config.ts`. Plain `provideHttpClient()` makes Angular silently ignore `HTTP_INTERCEPTORS`, which is the trap
  that makes a bootstrap module look necessary. Prefer functional interceptors (`withInterceptors([...])`) in new
  code. If something ever wants a named home, use a providers-only `@NgModule` via `importProvidersFrom()`, never a
  bootstrap `AppModule`.

## Data loading

- Use `httpResource()` in `src/app/services/**` for HTTP reads, consuming its `isLoading` / `error` / `value` signals
  rather than subscribing manually.
- Use `resource()` / `rxResource()` for non-HTTP async work.
- `HttpClient` is Fetch-based by default in v22. Build with the `application` builder — the Webpack-based builders are
  deprecated.

## Forms

- Use Signal Forms for new forms: schema validators (`required()`, `minLength()`) bound through `[formField]`.
- Reactive Forms only where the compatibility layer is genuinely needed.

## Accessibility (WCAG 2.2 AA)

The app must meet **WCAG 2.2 Level AA**. A change is not done until it passes, in light **and** dark theme, and at
320px wide.

**The rules are in [`docs/claude/accessibility.md`](docs/claude/accessibility.md): read it before changing a template,
a stylesheet, or anything a reader clicks, focuses or hears announced.** It covers controls and names, focus,
announcements, structure, colour and size, and how to check your work.

## Naming

- Files/folders: kebab-case.
- Components: `*.component.ts`, class suffix `Component` (e.g. `InputRowComponent`), selector **`changeme-*`**
  (e.g. `changeme-input-row`) — this is the `prefix` in `angular.json`, and every component uses it.
  - The CLI no longer generates this suffix, so set it as a schematics default in `angular.json`
    (`@schematics/angular:component` → `"type": "component"`), otherwise every `ng g c` needs `--type=component`.
- Services: `*.service.ts`, class suffix `Service` (e.g. `<Feature>Service`).

## Testing (Vitest, via `ng test`)

**What each level of testing proves, how to run it and where to add to it is in [`docs/testing.md`](docs/testing.md):
read it before adding or changing tests.** The end-to-end suite (Playwright, `e2e/`, `npm run e2e`) drives the real
app against the real API; the rules below are for the unit and service specs.

- Spec files live next to source (`*.spec.ts`); one focused `describe` per unit.
- Components: `TestBed.createComponent(...)`, `fixture.componentRef.setInput(...)` for inputs,
  `await fixture.whenStable(); fixture.detectChanges();` before assertions. Assert both rendered DOM and emitted
  outputs. Import standalone components directly into `TestBed.configureTestingModule({ imports: [...] })`.
- Services: `provideHttpClient()` + `provideHttpClientTesting()`, verify requests via `HttpTestingController`, call
  `httpTestingController.verify()` in `afterEach`. This still applies to `httpResource()`, which uses `HttpClient`
  underneath — assert its state through its signals rather than awaiting promises.
- Use Vitest globals (`describe`, `it`, `expect`, `vi`) and typed mocks where useful.
- **Never `vi.mock()` a module.** The Angular builder runs test files with `isolate: false`, so they share one module
  cache: whether a spec gets its mock or the real module depends on which spec in the same worker loaded it first, and
  the result flips between runs. Put the dependency behind an `InjectionToken` and supply the stand-in through TestBed
  instead (e.g. wrap a third-party library in a `THIRD_PARTY_LIB` token).

## User documentation (the help pages)

If the app ships help pages (Markdown in `src/assets/markdown/help`), **change what a user sees or does on a screen and
update its help page in the same change**, along with the glossary, the welcome page and any screenshot or animation the
change made wrong. Every label, message, limit and schedule on a page is copied from the code, never recalled.

**The steps are in [`docs/claude/user-docs.md`](docs/claude/user-docs.md): read it before you write or change a help
page, or add an image to one.**

## Changelog

`CHANGELOG.md` at the repo root holds one entry for every pull request merged into `dev`. **Every pull request adds its
own entry, at the moment the pull request is created** — not after it merges. A pull request without one is not ready
for review.

**The steps are in [`docs/claude/changelog.md`](docs/claude/changelog.md): read it when you create a pull request, or
change what an open one does.**

## Commands

- `ng serve` — run dev server
- `ng test` — run Vitest suite
- `ng build` — production build
- `npm run e2e` — Playwright end-to-end suite (needs a running local API)
