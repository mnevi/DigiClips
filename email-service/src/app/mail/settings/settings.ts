/**
 * Settings Component
 *
 * Manages user preferences:
 * - Theme selection
 * - Email display preferences
 * - Auto-save settings
 * - Email signature
 * - Notification preferences
 */

import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailService, UserPreferences } from '../../core/services/email';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SettingsComponent implements OnInit, OnDestroy {
  preferences = signal<UserPreferences | null>(null);
  activeTab = signal<'general' | 'appearance' | 'notifications' | 'signature'>('general');
  saveSuccess = signal(false);
  private destroy$ = new Subject<void>();

  constructor(
    private emailService: EmailService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const prefs = this.emailService.getPreferences();
    this.preferences.set(prefs());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectTab(tab: 'general' | 'appearance' | 'notifications' | 'signature'): void {
    this.activeTab.set(tab);
  }

  savePreferences(): void {
    const current = this.preferences();
    if (current) {
      this.emailService.updatePreferences(current);
      this.saveSuccess.set(true);
      setTimeout(() => this.saveSuccess.set(false), 3000);
    }
  }

  resetPreferences(): void {
    // Reset to default preferences by reloading
    const prefs = this.emailService.getPreferences();
    this.preferences.set(prefs());
  }

  goBack(): void {
    this.router.navigate(['/mail/inbox']);
  }

  toggleAutoSave(event: Event): void {
    const current = this.preferences();
    if (current) {
      current.autoSaveDraft = (event.target as HTMLInputElement).checked;
    }
  }

  toggleNotifications(event: Event): void {
    const current = this.preferences();
    if (current) {
      current.notificationsEnabled = (event.target as HTMLInputElement).checked;
    }
  }
}
