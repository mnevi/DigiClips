/**
 * Application Routes Configuration
 * 
 * Defines all the routes for the application:
 * - /login: Public login page (no authentication required)
 * - /mail: Protected email feature (requires AuthGuard, lazy-loaded)
 * - /: Default redirect to /mail (authenticated users land here)
 * 
 * Route Protection:
 * - AuthGuard is applied to the /mail route to prevent unauthorized access
 * - Unauthenticated users are redirected to /login by the guard
 * 
 * Performance:
 * - Mail module is lazy-loaded only when accessing /mail route
 * - Reduces initial bundle size
 * 
 * Usage: Imported and registered in app.config.ts via provideRouter()
 */

import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { AuthGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // Public route: User login page
  { path: 'login', component: LoginComponent },
  
  // Protected route: Email feature (lazy-loaded, requires authentication)
  {
    path: 'mail',
    canActivate: [AuthGuard], // Guard prevents unauthorized access
    loadChildren: () => import('./mail/mail-module').then(m => m.MailModule) // Lazy load module
  },
  
  // Default route: Redirect root to /mail (authenticated users)
  { path: '', redirectTo: 'mail', pathMatch: 'full' }
];