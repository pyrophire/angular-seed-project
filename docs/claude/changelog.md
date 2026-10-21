# Changelog: how to write a pull request's entry

Read this when you create a pull request, or change what an open one does. `CLAUDE.md` holds the rule itself; these are
the steps.

`CHANGELOG.md` at the repo root holds one entry for every pull request merged into `dev`. **Every pull request adds its
own entry, at the moment the pull request is created** — not after it merges. A pull request without one is not ready
for review.

When you create a pull request:

1. **Create it first** (`gh pr create`), so it has a number.
2. **Add the entry** at the top of today's date section (local time). If there is no `## YYYY-MM-DD` section for
   today, add one above the newest. Copy the shape of the entries already there:

   ```markdown
   ### [changeme #<N>](https://github.com/<org>/changeme/pull/<N>): <pull request title>

   Merged by **<full name of whoever will merge it; the author unless told otherwise>**

   - **Added:** …
   - **Changed:** …
   - **Fixed:** …
   ```

   - One line per change, each starting **Added**, **Changed**, **Fixed**, **Removed**, **Docs**, **CI** or **Tests**.
   - Say what is different for someone using the screen or working on the code, and name the thing: the screen, the
     component, the service, the environment flag. Leave out test counts and story numbers.
   - Add `- **Depends on:** <repo> #N.` when the change needs a pull request in another repo (such as the API).
3. **Mark breaking changes.** Add a quoted block under the entry, with the exact command or step:

   ```markdown
   > **BREAKING (local setup):** the screen stays empty until `environment.someFlag` is set in `src/environments/environment.ts`.
   ```

   Then add a row for it at the top of the **Breaking changes and required setup** table. A change is breaking when
   something stops working until someone acts, or a contract changes:
   - `local setup`: a new or renamed environment flag a developer must set, a new Node or npm version, or a screen
     that now needs something from the local API (a sign-in, a secret, a newer API build).
   - `deploy`: a host name, share, permission or workflow change a server or runner now needs.
   - `behaviour`: a route, query parameter, storage key or shared service that now behaves differently for existing
     callers.

   A step with no surprise attached (`npm ci` after a new dependency) is `> **Setup:**`, and gets no table row.
4. **Commit `CHANGELOG.md` to the pull request's branch and push.**

Keeping it honest:

- Change what the pull request does and update its entry in the same push.
- If it merges on a later day, or someone else merges it, correct the date section and the name before merging.
- When `CHANGELOG.md` conflicts with `dev`, keep both sides' entries, newest first. Never drop an entry to resolve a
  conflict.

## Starting the file

A new project's `CHANGELOG.md` starts like this:

```markdown
# Changelog

One entry for every pull request merged into `dev`, newest first.

## Breaking changes and required setup

| Date | Pull request | Kind | What to do |
| ---- | ------------ | ---- | ---------- |

## YYYY-MM-DD
```
