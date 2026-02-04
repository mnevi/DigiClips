/**
 * Authentication Guard
 * 
 * Route guard that protects routes from unauthorized access.
 * 
 * Responsibilities:
 * - Check if user is authenticated before allowing route access
 * - Redirect unauthenticated users to login page
 * - Support multiple response types (boolean, Promise, Observable)
 * 
 * Implementation:
 * - Implements Angular's CanActivate interface
 * - Calls AuthService.isAuthenticated() to check authentication status
 * - Handles three types of responses:
 *   a) Observable: Used for async authentication checks
 *   b) Promise: Used for async operations
 *   c) Boolean: Used for synchronous checks
 * 
 * Route Protection:
 * - Allows access if user is authenticated
 * - Redirects to /login if user is not authenticated
 * 
 * Usage:
 * - Applied to protected routes in app.routes.ts
 * - Example: { path: 'mail', canActivate: [AuthGuard], ... }
 * 
 * Scope: Singleton (providedIn: 'root')
 * 
 * Security Flow:
 * User Accesses Protected Route
 *  ↓
 * AuthGuard.canActivate() called
 *  ↓
 * Check AuthService.isAuthenticated()
 *  ↓
 * Authenticated? → Yes → Allow Access
 * Authenticated? → No → Redirect to /login
 */

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth';

@Injectable({ providedIn: 'root' }) // Singleton guard available app-wide
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService, // Service to check authentication status
    private router: Router // Router for navigation/redirection
  ) {}

  /**
   * Determines if a route can be activated
   * 
   * Angular calls this method before activating a route that has this guard.
   * 
   * @param route - The route snapshot containing route configuration
   * @param state - The router state snapshot with navigation state
   * @returns Allows access (true) or redirects to /login (UrlTree)
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Check authentication status (can return Observable, Promise, or boolean)
    const res: any = this.auth.isAuthenticated();

    // Handle Observable response (async authentication check)
    if (res && typeof res.subscribe === 'function') {
      return (res as Observable<boolean>).pipe(
        take(1), // Take only the first value
        map((ok) => (ok ? true : this.router.createUrlTree(['/login']))) // Map to boolean or redirect
      );
    }

    // Handle Promise response (async operation)
    if (res && typeof res.then === 'function') {
      return (res as Promise<boolean>).then((ok) =>
        ok ? true : this.router.createUrlTree(['/login']) // Resolve to boolean or redirect
      );
    }

    // Handle synchronous boolean response (current implementation uses this)
    return res ? true : this.router.createUrlTree(['/login']); // Allow or redirect
  }
}