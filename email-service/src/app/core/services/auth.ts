/**
 * Authentication Service
 * 
 * Core service for managing user authentication state and token management.
 * 
 * Responsibilities:
 * - Handle user login/logout
 * - Manage authentication tokens in localStorage
 * - Check authentication status
 * 
 * Token Management:
 * - Storage Key: 'auth_token' in localStorage
 * - Current Implementation: Mock JWT token ('mock-jwt-token')
 * - Persists: Across page refreshes until logout
 * 
 * Security Note:
 * - ⚠️ Current implementation uses localStorage (vulnerable to XSS)
 * - TODO: Migrate to HttpOnly cookies or secure token storage
 * - TODO: Implement real JWT validation from backend
 * 
 * Scope: Singleton (providedIn: 'root')
 * - Single instance shared across entire application
 * - Injectable into components and other services
 * 
 * Usage:
 * - LoginComponent: Calls login() to authenticate users
 * - AuthGuard: Calls isAuthenticated() to check route access
 * - App Components: Call logout() for sign-out functionality
 */

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' }) // Singleton service available app-wide
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token'; // localStorage key for auth token
  private readonly USER_KEY = 'auth_user'; // localStorage key for user email

  /**
   * Authenticates user with email and password
   * 
   * @param email - User's email address
   * @param password - User's password
   * @returns true if login successful, false otherwise
   * 
   * Current Behavior:
   * - Validates email and password are not empty
   * - Stores 'mock-jwt-token' in localStorage
   * - TODO: Replace with actual API call to backend
   * - TODO: Validate credentials against real database
   */
  login(email: string, password: string): boolean {
    // Simple validation: both fields must have values
    if (email && password) {
      // Store token in localStorage (mock token for now)
      localStorage.setItem(this.TOKEN_KEY, 'mock-jwt-token');
      localStorage.setItem(this.USER_KEY, email);
      return true; // Login successful
    }
    return false; // Login failed
  }

  /**
   * Logs out the current user by removing authentication token
   * 
   * Process:
   * - Removes token from localStorage
   * - User must log in again to access protected routes
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY); // Clear token
    localStorage.removeItem(this.USER_KEY); // Clear user
  }

  /**
   * Checks if user is currently authenticated
   * 
   * @returns true if token exists in localStorage, false otherwise
   * 
   * Usage:
   * - AuthGuard uses this to protect routes
   * - Components use this to conditionally show/hide auth-dependent UI
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY); // Check if token exists
  }

  /**
   * Gets the current logged-in user's email
   * 
   * @returns User's email if logged in, null otherwise
   */
  getCurrentUser(): string | null {
    return localStorage.getItem(this.USER_KEY);
  }
}