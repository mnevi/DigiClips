/**
 * Root Application Component
 * 
 * This is the top-level component that serves as the entry point for the entire application.
 * 
 * Responsibilities:
 * - Provides the main application layout
 * - Renders the RouterOutlet for route-based component rendering
 * - Manages application-level styling and theming
 * 
 * Architecture:
 * - Standalone component (no module wrapping required)
 * - Uses Angular signals for reactive state management
 * - Imports RouterOutlet for route rendering
 * 
 * Usage:
 * - Bootstrapped in main.ts
 * - Provides <router-outlet> for nested route components
 * - Child routes (login, mail) are rendered here
 */

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet], // Enable routing in this component
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Application title using Angular signals (reactive primitive)
  protected readonly title = signal('email-service');
}
