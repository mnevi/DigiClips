/**
 * Application Entry Point
 * 
 * This is the main bootstrap file for the Angular application.
 * It:
 * - Imports the root component (App)
 * - Imports the application configuration (appConfig)
 * - Bootstraps the application with standalone API
 * 
 * Usage: This file is referenced in angular.json as the main entry point
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Bootstrap the root component with application configuration
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
