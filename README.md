# Eli's Kinda Ok Angular Seed Project

A comprehensive Angular seed project with pre-configured environment settings, theming system, and useful utilities for rapid application development.

## Features

- **Environment Configuration**: Flexible boolean toggles for UI features
- **Custom Theming**: SCSS variable system for consistent styling
- **Utility Components**: Go-to-top button, scroll tracker, and footer components
- **License Management**: Built-in license checker and display module
- **Development Tools**: Automated dependency management and audit reporting
- **CI/CD Pipeline**: GitHub Actions workflows for automated building and deployment

## Setup

1. Clone Repository
2. Search and replace all instances of `CHANGEME` with your own project name (no-spaces)
3. Run `npm install`
4. Run `ng s`
5. Open browser to http://localhost:4200

## Project Structure

```
src/
├── environments/           # Environment configuration files
├── assets/
│   └── styles/
│       └── vars.scss      # Global SCSS variables and theming
├── app/
│   ├── components/        # Reusable UI components
│   ├── models/           # TypeScript interfaces and data models
│   ├── services/         # Application services
│   └── modules/          # Feature modules (including license module)
└── ...
```

## Environment Configuration

Environment files (`.env`, `environment.ts`, `environment.prod.ts`) contain boolean flags to control global UI features:

### Available Settings

- **`goToTop`**: Enables/disables the floating "go to top" button that appears when scrolling
- **`scrollTracker`**: Shows/hides the scroll progress indicator
- **`footer`**: Controls the visibility of the application footer

### Usage Example
```typescript
// environment.ts
export const environment = {
  production: false,
  goToTop: true,
  scrollTracker: true,
  footer: true
};
```

## Styling System (vars.scss)

The `vars.scss` file contains the theming system and shared styling variables:

### Theme Variables
- **Color Palette**: Primary, secondary, accent colors
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: Consistent margin and padding scales
- **Breakpoints**: Responsive design breakpoints
- **Animations**: Transition durations and easing functions

### Component-Specific Variables
- Button styles and states
- Form input styling
- Card and container layouts
- Navigation styling

## Key Packages & Dependencies

### Core Framework
- **Angular**: Latest stable version with CLI tools
- **RxJS**: Reactive programming utilities
- **TypeScript**: Type-safe JavaScript development

### UI & Styling
- **SCSS**: Enhanced CSS preprocessing
- **Angular Material** (if included): UI component library

### Development Tools
- **ESLint/TSLint**: Code quality and style enforcement
- **Prettier**: Code formatting
- **Karma/Jasmine**: Unit testing framework

### Utility Packages
- **npm-audit-html**: Security audit report generation
- **license-checker**: License compliance monitoring
- **rimraf**: Cross-platform file/directory removal

## Models & Interfaces

The project includes TypeScript models for:

### Core Models
- **User**: User account and profile information
- **ApiResponse**: Standardized API response wrapper
- **NavigationItem**: Menu and routing structure
- **Theme**: Theme configuration object

### Utility Models
- **License**: Software license information for compliance display
- **ScrollPosition**: Scroll tracking data structure
- **ComponentState**: Generic component state management

## Components & Services

### Utility Components
- **GoToTopComponent**: Floating scroll-to-top button
- **ScrollTrackerComponent**: Visual scroll progress indicator
- **FooterComponent**: Application footer with configurable content
- **LicenseComponent**: Displays project license information

### Core Services
- **ThemeService**: Manages application theming and dark/light mode
- **ScrollService**: Handles scroll position tracking and smooth scrolling

## Customizing

* Environment files control global UI feature toggles (goToTop, scrollTracker, footer)
* `vars.scss` contains all theme variables and shared styling configurations
* Component styles can be customized by modifying SCSS variables
* New features can be toggled via environment configuration

## NPM Commands

* `npm run update-all` - Update all Angular-specific libraries to latest compatible versions
* `npm run fresh` - Delete node_modules and package-lock.json, then reinstall all dependencies
  * Requires `rimraf`: `npm install -g rimraf`
* `npm run audit` - Run npm audit and generate an HTML security report
  * Requires `npm-audit-html`: `npm install -g npm-audit-html`
* `npm run license-checker` - Generate JSON file of all package licenses for the license module
  * View results at `http://localhost:4200/license`

## Development Workflow

1. **Feature Development**: Use environment flags to toggle new features during development
2. **Styling**: Modify `vars.scss` for theme changes, use CSS custom properties for component-specific styling
3. **Testing**: Run `ng test` for unit tests, `ng e2e` for end-to-end tests
4. **Building**: Use `ng build --prod` for production builds
5. **Deployment**: Configure environment files for different deployment targets

## License Management

The project includes a built-in license checker that:
- Scans all npm dependencies for license information
- Generates a compliance report accessible at `/license` route
- Helps maintain legal compliance for commercial applications

## GitHub Actions Workflows

The project includes automated CI/CD pipelines using GitHub Actions:

### Available Workflows

#### 1. DEV Build and Deploy (`01-dev-build-and-deploy.yml`)
- **Trigger**: Push to `dev` branch or manual workflow dispatch
- **Runner**: Self-hosted runner group
- **Environment**: Development
- **Actions**:
  - Builds Angular application for development environment
  - Deploys using RXploder deployment system
  - Sends dependency reports to DepView API for security monitoring

### Workflow Features

- **Property Logging**: Displays build paths, deployment URLs, and configuration settings
- **Flexible Branching**: Manual dispatch allows building from any branch
- **Dependency Tracking**: Automatically reports npm dependencies for security analysis
- **Environment-Specific**: Uses environment variables for configuration management

### Required Environment Variables

Configure these in your GitHub repository settings:

#### RXploder Deployment Variables
- `RXPLODER_DEPLOY_PACKAGES_SRC`: Source path for deployment packages
- `RXPLODER_DEPLOY_URL`: Target deployment URL
- `RXPLODER_APPNAME`: Application name for deployment
- `RXPLODER_ENVIRONMENT`: Deployment environment (dev/staging/prod)
- `RXPLODER_VERBOSE`: Enable verbose logging (true/false)
- `RXPLODER_CLEAN`: Clean deployment directory before deploy (true/false)
- `RXPLODER_DEBUG`: Enable debug mode (true/false)
- `RXPLODER_BACKUP`: Create backup before deployment (true/false)

#### Dependency Monitoring Variables
- `DEPVIEW_APP_NAME`: Application name for dependency tracking

### Deployment Process

1. **Build Phase**: Compiles Angular application with environment-specific configuration
2. **Deploy Phase**: Uses RXploder system to deploy to target environment
3. **Monitoring Phase**: Reports dependencies to DepView for security analysis
