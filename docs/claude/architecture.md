# Architecture: how each feature is put together

Read the section for the feature you are about to change. `CLAUDE.md` has the layout of the app and the rules that apply
everywhere; this file is the detail, one section per feature. Change how a feature works and update its section in the
same change. Add a section, and a row in the table below, when you add a feature.

| Working on                    | Section                                     |
| ----------------------------- | ------------------------------------------- |
| Any call to the backend       | [Backend access](#backend-access)           |
| Feature switches              | [App feature settings](#app-feature-settings) |
| <!-- feature -->              | <!-- [Section](#section) -->                |

## Backend access

<!-- Where the backend's base URL comes from (environment.ts), the helper that builds request URLs, whether calls go
through proxy.conf.json or straight to the API's origin (CORS), and which interceptors run on every request. -->

## App feature settings

<!-- How a feature is kept back: the settings service, its list of switches, the matching API key, the page where an
administrator turns them on and off, and how screens, routes and help pages read the switch. -->

<!--
## <Feature name>

One paragraph: what the feature does for the user, and the route(s) it lives on.

### Components and services

Which components make up the screen, which service owns its state, and which API endpoints it calls.

### State and data flow

Which signals hold the state, where they are written, and what is remembered (localStorage vs server).

### Rules

Anything that must not change without thought: ordering, focus, kept-back behaviour, traps found the hard way.
-->
