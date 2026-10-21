# Accessibility (WCAG 2.2 AA)

Read this before changing a template, a stylesheet, or anything a reader clicks, focuses or hears announced.

The app must meet **WCAG 2.2 Level AA**. A change is not done until it passes these rules, in light **and** dark theme,
and at 320px wide.

- Prefer `@angular/aria` primitives (tabs, combobox, accordion, …) and CDK (`ListKeyManager`, `FocusTrap`,
  `LiveAnnouncer`) over hand-rolled interactive widgets — they ship the keyboard handling and ARIA attributes.

## Controls and names

- **Anything clickable is a `<button type="button">` or an `<a href>`.** Never put `(click)` on a `div`, `span`,
  `li` or `article` as the only way to do something — keyboard and screen-reader users cannot reach it. A card
  click is fine only as a mouse shortcut for a real button or link inside it.
- **Every icon-only button has an `aria-label`.** `title` alone is not enough: touch and keyboard users never see
  it. `mat-icon` is `aria-hidden` by default, so an `aria-label` on the icon itself does nothing.
- **The accessible name starts with the visible text** (2.5.3 Label in Name): visible "Open report" →
  `aria-label="Open report: {{ name }}"`, never "Open {{ name }} report". Voice-control users say what they see.
- **A toggle keeps a fixed name and exposes its state**: `aria-pressed` (on/off) or `aria-expanded` +
  `aria-controls` (shows/hides a panel). Never change the name *and* set the state — it is announced twice and
  contradicts itself.
- `role="separator"` resize handles always carry `aria-valuenow/min/max` and an `aria-valuetext`. Build one shared
  resizable-pane component and reuse it rather than building another splitter.
- Form fields have a real label: `mat-label`, `<label for>` or `aria-labelledby`. A placeholder is not a label.

## Focus

- **Never remove focus styles.** No `outline: none` without a `:focus-visible` replacement of at least 2px in a
  colour with 3:1 contrast. Material controls get their ring from `mat.strong-focus-indicators` in the theme file;
  custom controls use `outline: 2px solid var(--mat-sys-primary); outline-offset: 2px`.
- **Never let focus fall to `<body>`.** When the focused element is about to disappear — `@if` swapping a button,
  closing a panel or dialog — move focus first: back to the control that opened it, or to the nearest sensible place
  (a nearby input, the panel toggle, `main`). Swap a button's icon/label/action rather than swapping two buttons with
  `@if`.
- A panel or overlay that opens on request moves focus to its heading (`tabindex="-1"`) and closes on Escape,
  returning focus to its opener.
- Handle route changes in one global service (focus moves to the page `<h1>`, or the title is announced). Don't add
  per-page focus code for navigation.
- **Nothing may hide the focused element** (2.4.11). Fixed, floating or sticky UI must scroll focused content clear of
  itself.
- **Don't flood the tab order.** A long list of same-kind controls is one tab stop with arrow-key navigation (roving
  `tabindex`, CDK `ListKeyManager`), not hundreds of stops.
- Anything focusable must be visible. A control hidden with `transform: scale(0)` or `opacity: 0` is still in the
  tab order — use `@if`, `hidden`, `visibility: hidden` or `inert`.

## Announcements (status messages)

- **Use CDK `LiveAnnouncer` or one always-present live region**, and change only its text. A `role="status"`
  element created by `@if` *with its text already inside* is usually not announced at all.
- Announce outcomes, not every change: "Saved", "12 results found", "No results match these filters". Throttle
  progress messages (at most one every few seconds).
- **Never make streaming or auto-updating text a live region** — it is read out piece by piece. Announce once when
  it finishes.
- Errors use `role="alert"`, and say what to do next.

## Structure and meaning

- **One `<h1>` per page.** Panels and sections start at `<h2>`, and levels never skip. Rendered Markdown or other
  user content is demoted so it can never produce an `h1`.
- **Turning a styled `div`/`span` into a heading changes its look** unless you stop Material's type scale:
  `<body class="mat-typography">` gives every `hN` a large font, line height and bottom margin through
  `.mat-typography hN`, which beats a single-class rule. Scope the rule as `.mat-typography .your__title` and reset
  the heading styles first (a shared `plain-heading` mixin works well). Check the heading still lines up with its row.
- Group a page's parts in landmarks: `<header>`, `<nav>`, `<main>` (in the shell), and `<section aria-labelledby>`
  for panels. `aria-label` on a plain `div` is ignored.
- **Never carry meaning by colour or position alone** (1.4.1, 1.3.1): who sent a message, added/removed text in a
  comparison, a selected or marked row, a link inside running text. Add text (visible or visually hidden), a shape,
  an icon or an underline. Links inside text are underlined globally — don't turn that off.
- Visually hidden text uses CDK's **`cdk-visually-hidden`** class. Don't invent new `sr-only` classes.
- Tables have `<th scope>`; lists are `<ul>/<ol>`; label/value pairs are `<dl>`.
- Every route has a `title`; a page about one thing sets a specific one at runtime.

## Colour, size, motion

- Colours come from `--mat-sys-*` tokens, which pass contrast in both themes. A hardcoded or custom colour must
  be checked: **4.5:1** for text, **3:1** for large text (≥24px, or ≥18.66px bold), borders, icons and focus
  rings.
- **Pointer targets are at least 24×24 CSS px** (2.5.8), or have 24px of clear space around them. Inline links
  in text are exempt.
- **Every drag has a single-click alternative** (2.5.7): step buttons, a menu or presets — arrow keys alone
  don't count, they only help keyboard users.
- **Layouts reflow at 320px wide and 400% zoom without losing content** (1.4.10). Hiding a panel below a
  breakpoint is a failure unless the same content is reachable another way (a tab, an overlay, a sheet). Let
  bars wrap rather than clip.
- Any animation that loops or lasts more than 5 s stops under `@media (prefers-reduced-motion: reduce)`, and
  auto-scrolling stops as soon as the user interacts with it.
- Prerecorded video needs captions (1.2.2).

## Checking your work

- Keyboard pass: Tab through the whole screen. Every control is reachable, its focus ring is visible and never
  hidden, the order makes sense, and focus never jumps to the top of the page.
- Automated pass: run axe-core (WCAG 2.0/2.1/2.2 A + AA tags) against the running page in both themes. Axe
  catches roughly a third of issues, so it is a floor, not a sign-off.
- Resize to 320px wide and to a 200%-zoom-sized window (half your screen size); nothing may disappear or clip.
- Screen reader spot-check (VoiceOver: ⌘F5, NVDA on Windows) for anything that announces, streams or moves focus.
- Specs assert the ARIA contract of what you change: names, `aria-pressed`/`aria-expanded`, where focus goes,
  and what gets announced (inject `LiveAnnouncer` and spy on `announce`).
