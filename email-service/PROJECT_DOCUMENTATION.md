# Email Service - Project Documentation

**Version:** 0.0.0  
**Framework:** Angular 21.1.2  
**Language:** TypeScript 5.9.2  
**Package Manager:** npm 11.6.2  
**Test Runner:** Vitest 4.0.8

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Project Structure](#project-structure)
4. [Setup & Installation](#setup--installation)
5. [Running the Application](#running-the-application)
6. [Build & Deployment](#build--deployment)
7. [Module Documentation](#module-documentation)
8. [Services Documentation](#services-documentation)
9. [Guards Documentation](#guards-documentation)
10. [Components Documentation](#components-documentation)
11. [Routing](#routing)
12. [Testing](#testing)
13. [Code Quality](#code-quality)
14. [Dependencies](#dependencies)
15. [Development Workflow](#development-workflow)

---

## Project Overview

**Email Service** is an Angular-based web application designed to provide email functionality. The application follows Angular 21 best practices with a modular architecture, incorporating authentication, routing guards, and lazy-loaded feature modules.

### Key Features

- **User Authentication:** Login system with mock JWT token management
- **Protected Routes:** Auth guard prevents unauthorized access to protected features
- **Modular Architecture:** Feature-based module structure with shared, core, auth, and mail modules
- **Lazy Loading:** Mail module is lazy-loaded for optimized performance
- **Responsive Design:** SCSS-based styling with modern CSS variables
- **Testing Framework:** Vitest for unit and component testing

### Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Angular | 21.1.0 | Core framework |
| Angular Router | 21.1.0 | Routing and navigation |
| Angular Forms | 21.1.0 | Reactive forms handling |
| RxJS | 7.8.0 | Reactive programming |
| TypeScript | 5.9.2 | Language |
| SCSS | (latest) | Styling |
| Vitest | 4.0.8 | Unit testing |
| JSDOM | 27.1.0 | DOM testing environment |

---

## Architecture

### Architectural Pattern

The application follows a **Feature-Based Module Architecture** with a clear separation of concerns:

```
┌─────────────────────────────────────┐
│      App Root (app.ts)              │
│      - RouterOutlet                 │
└────────┬────────────────────────────┘
         │
    ┌────┴────────────────────────────────────┐
    │                                         │
┌───▼──────────┐                    ┌────────▼────────┐
│  Auth Module │                    │  Mail Module    │
│ (Public)     │                    │  (Protected)    │
├──────────────┤                    ├─────────────────┤
│ - LoginComp  │                    │ - Lazy Loaded   │
└──────────────┘                    │ - Auth Guard    │
                                    └─────────────────┘
    │
    └──────────────┬──────────────────┐
                   │                  │
            ┌──────▼──────┐    ┌──────▼─────────┐
            │Core Module  │    │Shared Module   │
            ├─────────────┤    ├────────────────┤
            │- Services   │    │- Shared        │
            │- Guards     │    │  Components    │
            └─────────────┘    │- Utilities     │
                               └────────────────┘
```

### Module Organization

- **App**: Root component and routing configuration
- **Auth Module**: Authentication-related components and services
- **Core Module**: Singleton services, guards, and core functionality
- **Mail Module**: Email feature (lazy-loaded)
- **Shared Module**: Shared components and utilities

---

## Project Structure

```
email-service/
├── src/
│   ├── main.ts                          # Application entry point
│   ├── index.html                       # Main HTML file
│   ├── styles.scss                      # Global styles
│   │
│   └── app/
│       ├── app.ts                       # Root component
│       ├── app.html                     # Root template
│       ├── app.scss                     # Root styles
│       ├── app.routes.ts                # Application routes configuration
│       ├── app.config.ts                # Application configuration
│       ├── app.spec.ts                  # Root component tests
│       │
│       ├── auth/                        # Authentication feature module
│       │   ├── auth-module.ts           # Auth module definition
│       │   └── login/                   # Login component
│       │       ├── login.ts             # Login component class
│       │       ├── login.html           # Login template
│       │       ├── login.scss           # Login styles
│       │       └── login.spec.ts        # Login component tests
│       │
│       ├── core/                        # Core module (services, guards)
│       │   ├── core-module.ts           # Core module definition
│       │   ├── services/
│       │   │   ├── auth.ts              # Authentication service
│       │   │   └── auth.spec.ts         # Auth service tests
│       │   └── guards/
│       │       ├── auth-guard.ts        # Route guard for protected routes
│       │       └── auth-guard.spec.ts   # Auth guard tests
│       │
│       ├── mail/                        # Mail feature module (lazy-loaded)
│       │   └── mail-module.ts           # Mail module definition
│       │
│       └── shared/                      # Shared module
│           └── shared-module.ts         # Shared module definition
│
├── public/                              # Static assets
├── .angular/                            # Angular CLI metadata
├── .vscode/                             # VS Code configuration
├── angular.json                         # Angular CLI configuration
├── tsconfig.json                        # TypeScript root config
├── tsconfig.app.json                    # TypeScript app config
├── tsconfig.spec.json                   # TypeScript test config
├── package.json                         # NPM dependencies and scripts
├── package-lock.json                    # NPM lock file
└── README.md                            # Project README
```

---

## Setup & Installation

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v11.6.2 (specified in package.json)
- **Git**: For version control

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd email-service
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   
   > Note: The project uses npm 11.6.2 as specified in `package.json` via the `packageManager` field.

3. **Verify installation:**
   ```bash
   ng version
   ```

---

## Running the Application

### Development Server

Start a local development server with automatic reloading:

```bash
npm start
```

or

```bash
ng serve
```

- **Access the application:** Open your browser and navigate to `http://localhost:4200/`
- **Hot Reload:** The application automatically reloads when you modify source files
- **Development Configuration:** Uses unoptimized builds with source maps enabled

### Advanced Serve Options

**Serve on specific port:**
```bash
ng serve --port 3000
```

**Disable auto-open:**
```bash
ng serve --open=false
```

**Serve with specific configuration:**
```bash
ng serve --configuration development
```

---

## Build & Deployment

### Production Build

Build the project for production deployment:

```bash
npm run build
```

or

```bash
ng build
```

**Build Output:**
- Artifacts are generated in the `dist/` directory
- Configuration: Production (optimized)
- Output Hashing: Enabled (all)

### Build Configurations

#### Production Configuration
```
- Optimization: Enabled
- Output Hashing: All files
- Budget Warnings:
  - Initial: 500kB
  - Errors: 1MB
- Component Styles: 
  - Warning: 4kB
  - Error: 8kB
```

#### Development Configuration
```
- Optimization: Disabled
- Extract Licenses: No
- Source Maps: Enabled
```

### Watch Mode Build

Build continuously during development:

```bash
npm run watch
```

or

```bash
ng build --watch --configuration development
```

---

## Module Documentation

### 1. App Module (Root)

**File:** [src/app/app.ts](src/app/app.ts)

**Purpose:** Root component that serves as the entry point for the entire application.

**Component Details:**
- **Selector:** `app-root`
- **Standalone:** Yes (Standalone API)
- **Imports:** `RouterOutlet`
- **Template:** [app.html](src/app/app.html)
- **Styles:** [app.scss](src/app/app.scss)

**Key Functionality:**
```typescript
export class App {
  protected readonly title = signal('email-service');
}
```

- Defines the application title using Angular signals (reactive primitives)
- Provides the router outlet for route-based component rendering
- Manages the overall layout structure

**Template Structure:**
- Contains the `<router-outlet>` directive for route-based navigation
- Features gradient backgrounds and modern styling
- Responsive layout with CSS variables for theming

**Styling Variables:**
- **Colors:** Bright blue, electric violet, French violet, vivid pink, hot red, orange red
- **Gradients:** Red-to-pink-to-purple (vertical and horizontal)
- **Fonts:** Inter font family with system font fallbacks

---

### 2. Auth Module

**File:** [src/app/auth/auth-module.ts](src/app/auth/auth-module.ts)

**Purpose:** Manages authentication-related features and components.

**Module Configuration:**
- **Declarations:** Empty (using standalone components)
- **Imports:** `CommonModule`

**Sub-Components:**

#### Login Component
- **File:** [src/app/auth/login/login.ts](src/app/auth/login/login.ts)
- **Route:** `/login`
- **Standalone:** Yes
- **Imports:** `CommonModule`, `ReactiveFormsModule`

**Features:**
- User login form with email and password fields
- Form validation using Angular Reactive Forms
- Email format validation
- Error handling and display
- Redirects to `/mail/inbox` on successful login

**Form Structure:**
```typescript
form: FormGroup = {
  email: ['', [Validators.required, Validators.email]],
  password: ['', Validators.required]
}
```

---

### 3. Core Module

**File:** [src/app/core/core-module.ts](src/app/core/core-module.ts)

**Purpose:** Provides singleton services and guards for the entire application.

**Module Configuration:**
- **Declarations:** Empty
- **Imports:** `CommonModule`

**Responsibilities:**
- Authentication service management
- Route protection with guards
- Global error handling

---

### 4. Mail Module

**File:** [src/app/mail/mail-module.ts](src/app/mail/mail-module.ts)

**Purpose:** Email feature module with lazy-loading support.

**Module Configuration:**
- **Declarations:** Empty
- **Imports:** `CommonModule`

**Lazy Loading:**
- Loaded via route: `/mail`
- Activated with `AuthGuard`
- Reduces initial bundle size

**Status:** Currently a placeholder module - ready for feature expansion

---

### 5. Shared Module

**File:** [src/app/shared/shared-module.ts](src/app/shared/shared-module.ts)

**Purpose:** Provides shared components, utilities, and directives used across multiple modules.

**Module Configuration:**
- **Declarations:** Empty
- **Imports:** `CommonModule`

**Intended Use:**
- Common UI components
- Shared utilities and helpers
- Reusable directives and pipes

---

## Services Documentation

### AuthService

**File:** [src/app/core/services/auth.ts](src/app/core/services/auth.ts)

**Scope:** Singleton service provided in `root` injector

**Purpose:** Manages user authentication state and token management.

#### Methods

##### `login(email: string, password: string): boolean`
- **Parameters:**
  - `email`: User's email address
  - `password`: User's password
- **Returns:** `true` if login successful, `false` otherwise
- **Behavior:** 
  - Validates email and password are not empty
  - Stores 'mock-jwt-token' in localStorage under 'auth_token' key
  - **Note:** Current implementation is a mock; replace with actual API call

##### `logout(): void`
- **Purpose:** Clears the authentication token
- **Behavior:** Removes 'auth_token' from localStorage

##### `isAuthenticated(): boolean`
- **Purpose:** Checks if user is currently authenticated
- **Returns:** `true` if token exists in localStorage, `false` otherwise

#### Storage Management

**Local Storage Key:** `auth_token`

**Current Implementation:**
- Mock JWT token: `'mock-jwt-token'`
- Stored in browser's localStorage
- Persists across page refreshes

**Security Note:**
- ⚠️ localStorage is vulnerable to XSS attacks
- Future implementation should consider:
  - HttpOnly cookies
  - Secure token storage strategies
  - CSRF protection

#### Test File
- **Location:** [src/app/core/services/auth.spec.ts](src/app/core/services/auth.spec.ts)

---

## Guards Documentation

### AuthGuard

**File:** [src/app/core/guards/auth-guard.ts](src/app/core/guards/auth-guard.ts)

**Scope:** Singleton service provided in `root` injector

**Purpose:** Route guard that protects routes from unauthorized access.

**Implements:** `CanActivate` interface

#### Method: `canActivate()`

**Parameters:**
- `route`: `ActivatedRouteSnapshot` - Information about the route
- `state`: `RouterStateSnapshot` - Information about the router state

**Returns:** `Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree`

**Logic:**
1. Calls `AuthService.isAuthenticated()` to check authentication status
2. Handles three types of responses:
   - **Observable Response:** Waits for Observable completion with `take(1)` and `map()` operators
   - **Promise Response:** Waits for Promise resolution
   - **Synchronous Response:** Returns boolean directly

**Access Control:**
- **Authenticated:** Returns `true` (allows navigation)
- **Not Authenticated:** Returns `router.createUrlTree(['/login'])` (redirects to login)

#### Usage in Routes

Protected routes are configured as:
```typescript
{
  path: 'mail',
  canActivate: [AuthGuard],
  loadChildren: () => import('./mail/mail-module').then(m => m.MailModule)
}
```

#### Test File
- **Location:** [src/app/core/guards/auth-guard.spec.ts](src/app/core/guards/auth-guard.spec.ts)

---

## Components Documentation

### App Component (Root)

**Location:** [src/app/app.ts](src/app/app.ts)

**Details:**
- **Selector:** `app-root`
- **Type:** Standalone component
- **Imports:** `RouterOutlet`
- **Template:** [app.html](src/app/app.html)
- **Styles:** [app.scss](src/app/app.scss)

**Responsibilities:**
- Provides main application layout
- Renders router outlet for nested routes
- Manages global styling and theming

---

### Login Component

**Location:** [src/app/auth/login/login.ts](src/app/auth/login/login.ts)

**Details:**
- **Selector:** `app-login`
- **Type:** Standalone component
- **Imports:** `CommonModule`, `ReactiveFormsModule`
- **Template:** [login.html](src/app/auth/login/login.html)
- **Styles:** [login.scss](src/app/auth/login/login.scss)

**Component State:**
```typescript
error: string = '';           // Error message display
form: FormGroup;              // Reactive form instance
```

**Initialization:**
- Creates reactive form with FormBuilder
- Sets up validation rules
- Initializes error handling

**Key Methods:**

**`submit(): void`**
- Validates form before submission
- Extracts credentials from form values
- Calls `AuthService.login()`
- On success: Navigates to `/mail/inbox`
- On failure: Displays error message

**Form Validation:**
```typescript
email: ['', [Validators.required, Validators.email]]
password: ['', Validators.required]
```

**Test File:** [login.spec.ts](src/app/auth/login/login.spec.ts)

---

## Routing

**Configuration File:** [src/app/app.routes.ts](src/app/app.routes.ts)

### Route Definitions

```typescript
export const routes: Routes = [
  // Public login route
  { path: 'login', component: LoginComponent },
  
  // Protected mail feature (lazy-loaded)
  {
    path: 'mail',
    canActivate: [AuthGuard],
    loadChildren: () => import('./mail/mail-module').then(m => m.MailModule)
  },
  
  // Default redirect
  { path: '', redirectTo: 'mail', pathMatch: 'full' }
];
```

### Route Details

#### Login Route (`/login`)
- **Type:** Public
- **Component:** `LoginComponent`
- **Protection:** None
- **Purpose:** User authentication

#### Mail Route (`/mail`)
- **Type:** Protected (requires authentication)
- **Guard:** `AuthGuard`
- **Lazy Loading:** Module imported on demand
- **Purpose:** Email functionality
- **Redirect if Unauthorized:** `/login`

#### Default Route (`/`)
- **Behavior:** Redirects to `/mail`
- **Match:** Exact path match required
- **Purpose:** Sets mail module as landing page for authenticated users

### Navigation Flow

```
┌─────────────────────────────────────────────────┐
│           User Arrives at App (/)              │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │ Redirect to    │
        │ /mail          │
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────────┐
        │ AuthGuard Check    │
        └────────┬───────────┘
                 │
        ┌────────┴──────────┐
        │                   │
        ▼                   ▼
   Authenticated      Not Authenticated
        │                   │
        ▼                   ▼
   /mail Routes        Redirect to /login
   (Mail Module)       (LoginComponent)
```

---

## Testing

### Test Framework: Vitest

**Configuration:**
- Test Runner: Vitest 4.0.8
- DOM Environment: JSDOM 27.1.0
- Language: TypeScript

### Running Tests

**Execute all tests:**
```bash
npm test
```

or

```bash
ng test
```

**Test Output:**
- Component tests: `*.spec.ts` files
- Coverage: Run with coverage flag
- Watch mode: Auto-rerun on file changes

### Test Files Structure

```
├── app.spec.ts                    # Root component tests
├── auth/
│   └── login/
│       └── login.spec.ts          # Login component tests
├── core/
│   ├── services/
│   │   └── auth.spec.ts           # Auth service tests
│   └── guards/
│       └── auth-guard.spec.ts     # Auth guard tests
```

### Testing Best Practices

1. **Unit Tests:** Test services and utilities in isolation
2. **Component Tests:** Test template rendering and user interactions
3. **Guard Tests:** Test route protection logic
4. **Mock Services:** Use test doubles for dependencies

### Example Test Structure

```typescript
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentName]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

---

## Code Quality

### TypeScript Configuration

**File:** [tsconfig.json](tsconfig.json)

**Key Settings:**
- **Target:** ES2022
- **Module:** ES2022
- **Strict Mode:** Enabled
- **No Implicit Any:** Enabled
- **Strict Property Initialization:** Enabled

### Code Style

**Prettier Configuration:** (from package.json)
- **Print Width:** 100 characters
- **Single Quotes:** Enabled
- **HTML Parser:** Angular-specific parser

**Prettier Configuration for HTML Files:**
```json
{
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "angular"
      }
    }
  ]
}
```

### Angular CLI Schematics

**SCSS Default:**
- New components generated with `.scss` style files
- Configured in `angular.json` schematics

### Recommended Tools

- **Linter:** ESLint (recommended setup)
- **Formatter:** Prettier (configured in package.json)
- **IDE:** VS Code (with Angular extensions)

---

## Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| @angular/common | ^21.1.0 | Common Angular utilities and directives |
| @angular/compiler | ^21.1.0 | Angular template compiler |
| @angular/core | ^21.1.0 | Core Angular framework |
| @angular/forms | ^21.1.0 | Form handling (Reactive & Template-driven) |
| @angular/platform-browser | ^21.1.0 | Browser platform support |
| @angular/router | ^21.1.0 | Routing and navigation |
| rxjs | ~7.8.0 | Reactive programming library |
| tslib | ^2.3.0 | TypeScript runtime library |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| @angular/build | ^21.1.2 | Angular build system |
| @angular/cli | ^21.1.2 | Angular CLI tooling |
| @angular/compiler-cli | ^21.1.0 | CLI-specific compiler |
| jsdom | ^27.1.0 | DOM implementation for testing |
| typescript | ~5.9.2 | TypeScript compiler |
| vitest | ^4.0.8 | Unit test framework |

### Peer Dependencies

All Angular packages are consistent at version 21.1.x for compatibility.

---

## Development Workflow

### Typical Development Session

#### 1. Start Development Server
```bash
npm start
```

#### 2. Open Application
Navigate to `http://localhost:4200/` in your browser

#### 3. Make Changes
Edit TypeScript, HTML, or SCSS files in `src/` directory

#### 4. View Changes
Browser auto-reloads with your changes (hot reload enabled)

#### 5. Run Tests
```bash
npm test
```

#### 6. Build for Production
```bash
npm run build
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: description of changes"

# Push to remote
git push origin feature/feature-name

# Create pull request on GitHub
```

### Code Generation with Angular CLI

#### Generate a new component:
```bash
ng generate component feature/component-name --standalone --style=scss
```

#### Generate a service:
```bash
ng generate service core/services/service-name
```

#### Generate a guard:
```bash
ng generate guard core/guards/guard-name
```

#### Generate a module:
```bash
ng generate module feature/feature-name
```

### Debugging

#### Browser DevTools
- Open Chrome DevTools (F12)
- Angular DevTools extension recommended
- Use source maps for TypeScript debugging

#### VS Code Debugging
Configure launch.json for VS Code debugger:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "attach",
      "name": "Attach Chrome",
      "urlFilter": "http://localhost:4200/*",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

### Performance Optimization

#### Bundle Analysis
```bash
ng build --stats-json
npm install webpack-bundle-analyzer --save-dev
# Analyze bundle
```

#### Lazy Loading
- Mail module is already lazy-loaded
- Additional features can be lazy-loaded via route configuration

#### Change Detection
- Uses OnPush strategy recommended for components
- Signals provide better reactivity than regular properties

---

## Project Milestones & Status

### Current Status: Early Development (v0.0.0)

### Completed Features
- ✅ Project scaffolding with Angular CLI
- ✅ Authentication module with login component
- ✅ Auth service with mock token management
- ✅ Route guards for protected routes
- ✅ Lazy-loaded mail module structure
- ✅ Modular architecture (Core, Shared, Auth, Mail)
- ✅ Reactive forms for login
- ✅ SCSS styling with variables

### In Progress / Planned
- ⏳ Complete mail module functionality
- ⏳ Email inbox, compose, and read views
- ⏳ Email service API integration
- ⏳ User profile management
- ⏳ Comprehensive test coverage
- ⏳ Production-ready authentication (OAuth, JWT with secure storage)
- ⏳ Email filtering and search
- ⏳ Attachment handling
- ⏳ Real-time notifications
- ⏳ Progressive Web App (PWA) features

---

## Common Issues & Solutions

### Issue: Port 4200 Already in Use
**Solution:**
```bash
ng serve --port 4300
```

### Issue: Dependencies Not Installed
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Hot Reload Not Working
**Solution:**
```bash
ng serve --poll 2000
```

### Issue: Build Size Exceeds Budget
**Solution:**
1. Enable production optimization
2. Check for large dependencies
3. Remove unused imports
4. Use lazy loading for feature modules

---

## Additional Resources

### Official Documentation
- [Angular Documentation](https://angular.dev)
- [Angular Router Guide](https://angular.dev/guide/routing)
- [Angular Forms Guide](https://angular.dev/guide/forms)
- [RxJS Documentation](https://rxjs.dev)

### Related Tools
- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vitest Documentation](https://vitest.dev)

### Best Practices
- Use standalone components (already implemented)
- Implement OnPush change detection
- Use services for state management
- Lazy load feature modules
- Follow Angular style guide
- Write comprehensive tests

---

## Contact & Support

For issues or questions:
1. Check the official Angular documentation
2. Review this project documentation
3. Consult team members or maintainers
4. Create GitHub issues for bug reports

---

**Documentation Last Updated:** January 28, 2026  
**Framework Version:** Angular 21.1.2  
**TypeScript Version:** 5.9.2

---

### Document Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 28, 2026 | Initial comprehensive documentation |

