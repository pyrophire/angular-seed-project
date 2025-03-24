# Eli's Kinda Ok Angular Seed Project
## Setup
1. Clone Repository
2. Search and replace all instances of `CHANGEME` with your own project name (no-spaces)
3. Run `npm install`
4. Run `ng s`
5. Open browser to http://localhost:4200

## Customizing
* .env files will have booleans for global setting goToTop, scrollTracker and footer
* vars.scss will have settings for theme and shared styling variables

## NPM Commands
* `npm run update-all` to update all Angular specific libraries
* `npm run fresh` to delete node modules, package-json and reinstall all dependencies
  * This requires `rimraf`, install with `npm install -g rimraf`
* `npm run audit` to run npm audit and generate a report in HTML format
  * This requires `npm-audit-html`, install with `npm install -g npm-audit-html`
* `npm run license-checker` to run npm license-checker and generate a JSON that is consumed by the license module routed at `http://localhost:4200/license`
