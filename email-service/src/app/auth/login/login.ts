/**
 * Login Component
 * 
 * Provides user authentication interface with email and password fields.
 * 
 * Features:
 * - Reactive form with validation (email format, required fields)
 * - Error message display on failed login
 * - Automatic navigation to /mail/inbox on successful authentication
 * - Integrates with AuthService for credential verification
 * 
 * Form Validation:
 * - Email: Required, must be valid email format
 * - Password: Required
 * 
 * Navigation:
 * - Success: Navigates to /mail/inbox
 * - Failure: Displays error message to user
 * 
 * Usage:
 * - Rendered at /login route (public, no authentication required)
 * - First component users see before accessing protected routes
 * 
 * Route: /login
 * Standalone: Yes
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule] // Imports for template and form handling
})
export class LoginComponent {
  error = ''; // Error message displayed when login fails
  form: FormGroup; // Reactive form instance

  constructor(
    private fb: FormBuilder, // Form builder for creating reactive forms
    private auth: AuthService, // Authentication service for login logic
    private router: Router // Router for navigation after login
  ) {
    // Initialize the login form with validation rules
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email field with validators
      password: ['', Validators.required] // Password field with required validator
    });
  }

  /**
   * Submits the login form
   * 
   * Process:
   * 1. Validates form before submission
   * 2. Extracts email and password from form values
   * 3. Calls AuthService.login() to authenticate
   * 4. On success: Navigates to /mail/inbox
   * 5. On failure: Displays error message
   */
  submit() {
    // Skip submission if form is invalid
    if (this.form.invalid) return;

    // Extract credentials from form
    const { email, password } = this.form.value;
    
    // Attempt login via AuthService
    const success = this.auth.login(email!, password!);

    // Navigate on success, show error on failure
    if (success) {
      this.router.navigate(['/mail/inbox']); // Navigate to inbox
    } else {
      this.error = 'Invalid credentials'; // Display error message
    }
  }
}