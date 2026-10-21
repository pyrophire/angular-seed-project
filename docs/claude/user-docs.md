# User documentation: how to write and update the help pages

Read this when you change anything a user sees or does on a screen, or when you are asked to write, correct or
illustrate the help pages. `CLAUDE.md` holds the rule itself; these are the steps.

The help pages are the documentation users read inside the app, at `/docs`. **A change to a screen is not done until its
help page says what the screen now does.** A page that describes last month's screen is worse than no page: the reader
trusts it.

## Where the pages live

```text
src/assets/markdown/
  manifest.json                     generated: never edit by hand
  help/
    index.md                        the welcome page
    images/                         every screenshot and animation, in one flat folder
    01-getting-started/
      01-finding-your-way-around.md
      02-glossary.md
    02-<section>/ …
```

- A page's address is `/docs/help/<section folder>/<file name>` without `.md`.
- If the viewer builds its page list from a generated manifest, regenerate it after any change (e.g.
  `npm run docs:manifest`) and commit it with the pages. The number prefixes give the order of sections and pages, and
  a page's title is its first `# heading`.
- A file or folder you rename changes the page's address, and a reader's bookmark to the old one breaks. Rename only
  when the old name is wrong.

## Who you are writing for

The app's users, who need no technical background to use it. Write so that someone who can type and click a link can
follow every page.

- Use the app's user-facing name, never an internal code name the reader has not seen.
- Use the reader's words, not the code's. A reader saves a *search*, not a `SavedQueryDto`. Where a technical term is on
  the screen, quote it and explain it in plain words.
- A word the app uses in its own way goes in the **Glossary**, and every page uses it the same way.

## Take every fact from the code

Nothing in a help page is written from memory. Before you write a sentence, find where it is true.

| What you are stating                       | Where to read it                                                                        |
| ------------------------------------------ | --------------------------------------------------------------------------------------- |
| A label, a button, a tooltip, a heading    | The component's `.html`, and `aria-label` for icon buttons. Copy it exactly, capitals included. |
| A message the reader may see               | The template or the service that sets it. Quote it whole.                               |
| What happens when they click               | The component and its service, then the feature's section in `docs/claude/architecture.md`. |
| A limit, a time or a schedule              | The constant or setting that holds it, in this repo or the API.                         |
| What is remembered, and where              | The service: localStorage is "remembered in this browser", server state follows the reader to another computer. |

- When the app does not say something a reader will want to know, say that it does not. Do not fill the gap with a
  guess.
- A setting an administrator controls is described as one.
- A button that does not work yet is documented as it behaves today.

## What stays out

- Kept-back features and staff-only screens: no page, no sentence, no screenshot of their screens.
- Class names, endpoints, signal names, story numbers and anything else only a developer would recognise.

## The shape of a page

Each page about a screen follows the same order, so a reader who has learned one page can find their way around the
next.

1. `# Title` in sentence case. This is the title in the page list.
2. One paragraph: what the screen lets the reader do.
3. The line `Words in **bold** are labels you see on screen. Unfamiliar terms are in the **Glossary**.`
4. `## What the screen is for`: when to use it, as a short list of things the reader wants to do.
5. `## How to get to it`.
6. `## What is on the screen`: one `###` per region, each a table of item and what it does.
7. One section per task, titled as the task ("How to create a report"): numbered steps, then what the reader will see,
   then a short "Things to know" list for limits and failures.
8. `## Messages you may see`: a table of the message, what it means and what to do.
9. `## How it works behind the scenes`, in plain words. Say which parts an AI wrote, if any.
10. `## Common questions`: the question in bold, the answer on the next line.

Conventions inside a page:

- **Bold** is an on-screen label, exactly as shown, and nothing else. Do not use bold for emphasis.
- Another page is named by its title in bold ("See **Settings**") rather than linked, so it survives renumbering.
- A message is quoted in straight double quotes, in full, with the button that comes with it.
- One action per numbered step, starting with the verb. Name the control by its label, and by its icon in brackets
  when it has no visible text: "Select **Alerts** (the bell icon)".
- Give a realistic example whenever the screen shows a value.
- A term a reader will search for must appear in ordinary text somewhere, not only in a table cell.
- Markdown only, no HTML. Every heading, list and table has a blank line before and after it.

## When a feature changes

The page for the screen is the start, not the whole job. The same fact is usually stated in several places.

1. Rewrite the screen's page from the code as it is now. Do not patch sentences one at a time on a page whose feature
   was redesigned: read the whole page against the component.
2. Search every page for the old words and fix each one:

   ```sh
   grep -rn -i "old label" src/assets/markdown/help --include='*.md'
   ```

3. Update the pages that summarise other pages: the welcome page, the glossary, the navigation page, and the settings
   page when a setting was added.
4. Retake any image the change made wrong. A screenshot of the old screen is a wrong fact.

## Images

Every image is in `src/assets/markdown/help/images/`, and a page refers to it as `../images/<name>`. Name it
`<screen>-<what it shows>`: `reports-list.png`, `reports-create.gif`.

Use a still (`.png`) to show what is on a screen, and an animation (`.gif`) for a task the reader carries out.

- **Put the image directly under the heading it illustrates**, before the text or the steps.
- **The alt text is a full sentence that tells a reader who cannot see the image what it shows**, naming the labels in
  it. An animation's alt text starts `Animation:` and tells the steps in order.

Capturing them:

- Run the app (`ng serve`) in the **light theme**, with reduced motion on, using realistic content. **Delete anything
  you created** when you finish.
- Stills: capture at twice the pixel density. A whole screen is saved 1800px wide; a single section or control,
  cropped to itself, 640 to 1040px wide.
- Animations: capture a 1200×750 window at about 5 frames a second, and save 960px wide with a 128-colour palette:

  ```sh
  ffmpeg -y -framerate 5 -i frames/f%05d.png -loop 0 -vf \
    "scale=960:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" \
    out.gif
  ```

  - Show where the pointer is, type a few characters at a time, and hold on each result long enough to read it.
  - Shorten long waits by taking fewer frames during them, and say so in the alt text.
- Keep a still under about 800 KB and an animation under about 500 KB. The whole folder ships with the app.
- Delete an image when its last reference goes.

## Check your work

1. Regenerate the manifest, if there is one, and read its diff.
2. Check that every image a page names exists and every image file is named by a page:

   ```sh
   cd src/assets/markdown/help
   refs=$(grep -rhoE 'images/[A-Za-z0-9._-]+' --include='*.md' . | sed 's|images/||' | sort -u)
   files=$(ls images | sort)
   comm -3 <(echo "$refs") <(echo "$files")   # prints nothing when they match
   ```

3. Open the changed pages in the running app, in the light and the dark theme.
4. Read each changed page once against the screen itself, label by label and step by step.
5. Search the pages for the names of kept-back features, and for every word the change retired.

A pull request that changes the help pages says so in its `CHANGELOG.md` entry with a `- **Docs:**` line.
