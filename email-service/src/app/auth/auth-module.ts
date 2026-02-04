/**
 * Authentication Module
 * 
 * Feature module that encapsulates all authentication-related functionality.
 * 
 * Responsibilities:
 * - Organize authentication components and services
 * - Provide authentication UI (login form)
 * - Manage user login/logout flows
 * 
 * Components:
 * - LoginComponent: User login form and authentication UI
 * 
 * Services:
 * - Relies on AuthService from core module (injected globally)
 * 
 * Current Status:
 * - Contains LoginComponent
 * - Empty declarations (using standalone components)
 * 
 * Usage:
 * - LoginComponent is used at /login route (not lazy-loaded)
 * - Automatically available since imports are done at component level
 * 
 * Future Expansion:
 * - Add registration component
 * - Add password reset component
 * - Add 2FA/MFA support
 * 
 * Routes:
 * - /login: LoginComponent
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [], // No declarations needed (using standalone components)
  imports: [
    CommonModule // Angular common utilities and directives
  ]
})
export class AuthModule { }
