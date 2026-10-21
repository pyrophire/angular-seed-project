# Testing changeme

How the app is tested, what each level proves, how to run it, and how to add to it.

## The levels

The suite follows the test pyramid: many fast, isolated tests at the bottom; a few slow, fully integrated tests at
the top. Each level has a job, and a test belongs at the lowest level that can do its job.

```text
        /  UI  \          Playwright, real browser, real API                   (slow, few)
       / service \        specs through HttpClient and real child components  (fast, some)
      /    unit    \      specs of one component, service or utility          (fastest, many)
```

| Level       | What it proves                                                                                                      | What it cannot prove                                                 | Where                                                                    | Runs                       |
| ----------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------- |
| **Unit**    | One component, service, pipe or utility does what its contract says, given stubbed collaborators.                   | That the pieces fit together; anything about the real API.           | `src/**/*.spec.ts`, Vitest on jsdom                                      | Every push, every `ng test` |
| **Service** | Components and services work together: a request goes out with the right shape and the answer renders; mock interceptors behave like the API they stand in for. | That the real API answers that way; how a real browser repaints. | Also `src/**/*.spec.ts`, using `HttpTestingController` and real child components | Same                       |
| **UI**      | The real app in a real browser against the real API: the main user journeys work end to end.                       | Fine-grained logic (too slow and expensive to cover it this way).    | `e2e/**/*.spec.ts`, Playwright                                           | `npm run e2e`              |

Why the UI level matters: the app is zoneless, and jsdom specs drive change detection themselves. They can prove
state, but not that a real browser repaints when a timer or a third-party event writes a signal.

## Unit and service specs (Vitest)

- **Runner:** Vitest on jsdom, through the Angular builder: `angular.json` → `test` → `@angular/build:unit-test`,
  `include: ["**/*.spec.ts"]` with `exclude: ["e2e/**"]` — the include is relative to the repo root and the
  Playwright specs are `*.spec.ts` too. `tsconfig.spec.json` adds the Vitest globals and `src/testing/**`.
- **Shared helpers** go in `src/testing/`: common TestBed providers, storage and toast stubs, fixtures and component
  harnesses. Reuse them before writing another.
- **Rules** are in `CLAUDE.md` under *Testing*: TestBed with `setInput` and `whenStable`; services through
  `HttpTestingController` with `verify()` in `afterEach`; **never `vi.mock()`**, because the builder runs specs with a
  shared module cache. Put a dependency behind an `InjectionToken` instead.
- **Mock backend:** environment flags in `src/environments/*.ts` can switch mock HTTP interceptors on, so a screen can
  be built and tested with no API. Specs can route through the real mock interceptors as a service-level test.

Run:

```sh
ng test --watch=false            # the whole suite, as CI runs it
ng test --include '**/users/**'  # one folder, for a fast loop while changing it
```

## End-to-end specs (Playwright)

Real browser, real app, real API. **The suite is UI tests only**: every spec opens the browser and works the screens
the way a person would. Checks of the API on its own belong in the API repo.

```sh
npm run e2e              # headless, as CI runs it
npm run e2e:headed       # watch the browser
npm run e2e:ui           # Playwright's UI mode: pick specs, step through, see the trace
npm run e2e:report       # open the HTML report of the last run
```

Prerequisites: `npx playwright install chromium` once, and a running local API.

### Adding a spec

- A new screen gets its own `e2e/smoke/<screen>.spec.ts`.
- Find elements by role, label or visible text first (`getByRole('button', { name: 'Save' })`, `getByLabel(...)`),
  then by the BEM class the component already has. Add a `data-testid` only when neither is stable.
- Give a failing assertion a message that says what the screen showed.
- Set up any data a spec needs through the screens, as a person would, never by writing to the database directly.
- Keep a spec to what the browser shows. A check that needs no screen is an API test.

## Known gaps

<!-- List services, components and screens with no spec, and whether there is a coverage threshold. -->
