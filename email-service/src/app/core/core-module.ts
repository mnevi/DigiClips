/**
 * Core Module
 * 
 * Singleton module that provides core application functionality.
 * 
 * Responsibilities:
 * - Provide singleton services (AuthService)
 * - Provide route guards (AuthGuard)
 * - Handle application-wide concerns
 * 
 * Services Provided:
 * - AuthService: User authentication and token management
 *   Scope: Singleton (providedIn: 'root')
 * 
 * Guards Provided:
 * - AuthGuard: Protects routes from unauthorized access
 *   Scope: Singleton (providedIn: 'root')
 * 
 * Best Practice:
 * - Core module should ONLY contain singleton services/guards
 * - Import CoreModule in root AppModule (or app.ts for standalone)
 * - All services are provided at root level, not module level
 * 
 * Current Status:
 * - Services provided via @Injectable({ providedIn: 'root' })
 * - No declarations needed (using standalone components/services)
 * 
 * Future Services:
 * - API service for backend communication
 * - Logger service for application logging
 * - Error handling service
 * - State management service
 * 
 * Usage:
 * - Imported at root level (though services work via DI)
 * - Provides centralized location for core functionality
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [], // No declarations needed
  imports: [
    CommonModule // Angular common utilities
  ]
})
export class CoreModule { }
