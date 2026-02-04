/**
 * Application Configuration
 * 
 * Defines the core providers and configuration for the entire application.
 * 
 * Providers:
 * - provideBrowserGlobalErrorListeners: Enables global error handling
 * - provideRouter: Registers the routing configuration from app.routes.ts
 * 
 * Usage: Passed to bootstrapApplication() in main.ts
 */

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Enable global error listeners for uncaught exceptions
    provideBrowserGlobalErrorListeners(),
    // Provide the routing configuration
    provideRouter(routes)
  ]
};
