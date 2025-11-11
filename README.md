# Eli's Kinda Ok Angular Seed Project

A comprehensive Angular seed project with **100% standalone components architecture**, pre-configured environment settings, theming system, and useful utilities for rapid application development.

## ✨ Latest Updates

**🎯 Standalone Components Migration (November 2025)**
- Fully migrated to Angular standalone components (no NgModules)
- Modern bootstrap process using `bootstrapApplication`
- Improved tree-shaking and bundle optimization
- Simplified component dependencies with explicit imports
- See [CHANGELOG.md](./CHANGELOG.md) for detailed migration notes

## Features

- **🚀 Modern Architecture**: 100% standalone components (no NgModules required)
- **Environment Configuration**: Flexible boolean toggles for UI features
- **Custom Theming**: SCSS variable system for consistent styling
- **Utility Components**: Go-to-top button, scroll tracker, and footer components
- **License Management**: Built-in license checker and display module
- **Development Tools**: Automated dependency management and audit reporting
- **CI/CD Pipeline**: GitHub Actions workflows for automated building and deployment
- **Type-Safe Paths**: Configured TypeScript path aliases for cleaner imports

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
│   ├── app.config.ts      # Application configuration (providers)
│   ├── app.routes.ts      # Route definitions
│   ├── app.component.ts   # Root component (standalone)
│   ├── material-imports.ts # Material Design imports helper
│   ├── shared-imports.ts  # Shared module imports helper
│   ├── components/
│   │   ├── common/        # Shared standalone components
│   │   └── home/          # Feature components
│   ├── models/            # TypeScript interfaces and data models
│   ├── services/          # Application services
│   ├── interceptors/      # HTTP interceptors
│   └── pipes/             # Custom pipes
└── ...
```

## Architecture Overview

This project uses **Angular Standalone Components** architecture:

### Core Files

- **`app.config.ts`**: Application-level configuration and providers (replaces AppModule)
- **`app.routes.ts`**: Route definitions (replaces routing modules)
- **`main.ts`**: Bootstrap entry point using `bootstrapApplication()`

### Component Structure

All components are standalone and explicitly declare their dependencies:

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, MaterialModule, ...]
})
export class ExampleComponent {}
```

### Import Helpers

- **`material-imports.ts`**: Export array of all Material Design modules
- **`shared-imports.ts`**: Export array of commonly used modules

Usage:
```typescript
import { SHARED_IMPORTS } from '@app/shared-imports';

@Component({
  standalone: true,
  imports: [...SHARED_IMPORTS]
})
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

1. **Creating Components**: Always use the `--standalone` flag
   ```bash
   ng generate component my-component --standalone
   ```

2. **Feature Development**: Use environment flags to toggle new features during development

3. **Adding Routes**: Edit `app.routes.ts` for route configuration
   ```typescript
   {
     path: 'feature',
     loadComponent: () => import('./components/feature/feature.component')
       .then(m => m.FeatureComponent)
   }
   ```

4. **Styling**: Modify `vars.scss` for theme changes, use CSS custom properties for component-specific styling

5. **Testing**: Components are tested individually without module configuration
   ```typescript
   TestBed.configureTestingModule({
     imports: [MyComponent] // Import standalone component directly
   })
   ```

6. **Building**: Use `ng build` for production builds
   ```bash
   ng build --configuration production
   ```

7. **Deployment**: Configure environment files for different deployment targets

## TypeScript Path Aliases

The project uses configured path aliases for cleaner imports:

```typescript
import { MyService } from '@services/my.service';
import { NavItem } from '@models/navItem.model';
import { NavigationComponent } from '@common/navigation/navigation.component';
import { environment } from '@environments/environment';
```

Available aliases:
- `@common/*` - Common/shared components
- `@services/*` - Application services
- `@models/*` - Data models and interfaces
- `@environments/*` - Environment configurations
- `@constants/*` - Application constants
- `@pipes/*` - Custom pipes
- `@enums/*` - Enumerations
- `@resolvers/*` - Route resolvers
- `@mocks/*` - Test mocks

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
- **Runner**: Self-hosted runner group (Make sure to update to your team's runner)
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

### Required GitHub Variables

Configure these in your GitHub repository settings under **Settings → Secrets and variables → Actions**.

#### Environment Variables
Environment-specific variables configured per environment (dev/test/prod):

| Variable               | Description                           | Example Values                                                                           |
| ---------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| `RXPLODER_BACKUP`      | Create backup before deployment       | `false` (dev/test), `true` (prod)                                                        |
| `RXPLODER_DEPLOY_URL`  | Target deployment URL for environment | `dev-appname.legis.texas.gov`, `test-appname.legis.texas.gov`, `appname.legis.texas.gov` |
| `RXPLODER_ENVIRONMENT` | Deployment environment identifier     | `Dev`, `Test`, `Prod`                                                                    |

#### Repository Variables
Global variables available across all environments:

| Variable                       | Description                              | Example Value    |
| ------------------------------ | ---------------------------------------- | ---------------- |
| `DEPVIEW_APP_NAME`             | Application name for dependency tracking | `AppName-Webapp` |
| `DEPVIEW_ENV`                  | Environment for dependency monitoring    | `dev`            |
| `RXPLODER_APPNAME`             | Application name for RXploder deployment | `AppName-webapp` |
| `RXPLODER_CLEAN`               | Clean deployment directory before deploy | `true`           |
| `RXPLODER_DEBUG`               | Enable debug mode during deployment      | `false`          |
| `RXPLODER_DEPLOY_PACKAGES_SRC` | Source path for deployment packages      | `\dist\browser`  |
| `RXPLODER_VERBOSE`             | Enable verbose logging during deployment | `true`           |

**Note**: Environment variables take precedence over repository variables when both are defined. Use environment variables for values that differ between dev/test/prod, and repository variables for values shared across all environments.

### Deployment Process

1. **Build Phase**: Compiles Angular application with environment-specific configuration
2. **Deploy Phase**: Uses RXploder system to deploy to target environment
3. **Monitoring Phase**: Reports dependencies to DepView for security analysis
