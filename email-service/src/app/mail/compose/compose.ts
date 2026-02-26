/**
 * Compose Component
 *
 * Modern email composition with:
 * - Draft auto-save functionality
 * - Label assignment
 * - File attachments
 * - Email signature support
 * - Real-time format preview
 * - AI-powered web scraping for current events
 */

import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { EmailService, Draft, Label } from '../../core/services/email';
import { AIService } from '../../core/services/ai';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-compose',
  templateUrl: './compose.html',
  styleUrls: ['./compose.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ComposeComponent implements OnInit, OnDestroy {
  currentUser = signal<string>('');
  allLabels = signal<Label[]>([]);
  selectedLabels = signal<string[]>([]);
  showLabelDropdown = signal(false);
  showCcBcc = signal(false);
  isSending = signal(false);
  isScraping = signal(false);
  saveStatus = signal<'saved' | 'saving' | 'unsaved'>('unsaved');
  lastSaveTime = signal<string>('');
  scrapingError = signal<string>('');

  draft: Draft = {
    id: 'draft-' + Date.now(),
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    avatar: 'U',
    date: new Date().toLocaleString(),
    labels: [],
    attachments: []
  };

  aiPrompt = signal<string>('');  // User's custom input for AI
  selectedFiles: File[] = [];
  private autoSaveInterval: any;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private emailService: EmailService,
    private aiService: AIService,
    private http: HttpClient
  ) {
    this.currentUser.set(this.authService.getCurrentUser() || 'User');
  }

  ngOnInit(): void {
    this.allLabels.set(this.emailService.getLabels()());
    this.setupAutoSave();
  }

  ngOnDestroy(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Setup auto-save functionality
   */
  private setupAutoSave(): void {
    const preferences = this.emailService.getPreferences();
    if (preferences().autoSaveDraft) {
      this.autoSaveInterval = setInterval(
        () => this.autoSaveDraft(),
        preferences().autoSaveInterval * 1000
      );
    }
  }

  /**
   * Auto-save draft if content changed
   */
  private autoSaveDraft(): void {
    if (this.draft.subject || this.draft.body || this.draft.to) {
      this.saveDraft(true);
    }
  }

  /**
   * Toggle CC/BCC fields
   */
  toggleCcBcc(): void {
    this.showCcBcc.set(!this.showCcBcc());
  }

  /**
   * Toggle label dropdown
   */
  toggleLabelDropdown(): void {
    this.showLabelDropdown.set(!this.showLabelDropdown());
  }

  /**
   * Add/remove label
   */
  toggleLabel(labelId: string): void {
    const current = this.selectedLabels();
    if (current.includes(labelId)) {
      this.selectedLabels.set(current.filter(l => l !== labelId));
    } else {
      this.selectedLabels.set([...current, labelId]);
    }
    this.draft.labels = this.selectedLabels();
  }

  /**
   * Get label details
   */
  getLabel(labelId: string): Label | undefined {
    return this.allLabels().find(l => l.id === labelId);
  }

  /**
   * Handle file input change
   */
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const incoming = Array.from(input.files);
    incoming.forEach(f => {
      const exists = this.selectedFiles.some(
        sf => sf.name === f.name && sf.size === f.size && sf.lastModified === f.lastModified
      );
      if (!exists) {
        this.selectedFiles.push(f);
      }
    });
  }

  /**
   * Remove attachment
   */
  removeAttachment(index: number): void {
    if (index >= 0 && index < this.selectedFiles.length) {
      this.selectedFiles.splice(index, 1);
    }
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Save draft
   */
  saveDraft(isAuto: boolean = false): void {
    if (!this.draft.subject && !this.draft.body && !this.draft.to) {
      return;
    }

    this.saveStatus.set('saving');
    setTimeout(() => {
      this.draft.date = new Date().toLocaleString();
      this.draft.labels = this.selectedLabels();
      this.emailService.saveDraft(this.draft);
      this.saveStatus.set('saved');
      this.lastSaveTime.set(new Date().toLocaleTimeString());

      if (!isAuto) {
        setTimeout(() => this.saveStatus.set('unsaved'), 3000);
      }
    }, 300);
  }

  /**
   * Send email
   */
  sendEmail(): void {
    if (!this.draft.to || !this.draft.body) {
      alert('Please fill in "To" and message body');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.draft.to.split(',')[0].trim())) {
      alert('Invalid email format for "To" field');
      return;
    }

    this.isSending.set(true);

    this.emailService
      .sendEmail(this.draft)
      .then(res => {
        console.log('Email sent:', res);
        alert('Email sent successfully!');
        this.isSending.set(false);
        this.closeCompose();
      })
      .catch(err => {
        console.error('Failed to send email', err);
        alert('Failed to send email. Please try again.');
        this.isSending.set(false);
      });
  }

  /**
   * Close compose window
   */
  closeCompose(): void {
    try {
      window.history.length > 1 ? window.history.back() : this.router.navigateByUrl('/mail/inbox');
    } catch (e) {
      this.router.navigateByUrl('/mail/inbox');
    }
  }

  /**
   * Generate content using user's custom prompt
   */
  scrapeCurrentEvent(): void {
    const prompt = this.aiPrompt().trim();
    
    if (!prompt) {
      this.scrapingError.set('Please enter a prompt or topic');
      return;
    }

    this.isScraping.set(true);
    this.scrapingError.set('');

    // Use custom prompt if provided, otherwise generate a default event
    this.aiService.fetchCurrentEvent(prompt).subscribe({
      next: (response) => {
        if (response.success && response.response) {
          // Insert generated content into email body
          if (this.draft.body) {
            this.draft.body += '\n\n' + response.response;
          } else {
            this.draft.body = response.response;
          }

          // Set subject from prompt if not already set
          if (!this.draft.subject && prompt) {
            this.draft.subject = this.capitalizeWords(prompt.substring(0, 50));
          }

          // Clear the prompt input
          this.aiPrompt.set('');
          this.isScraping.set(false);
        } else {
          this.scrapingError.set(response.error || 'Failed to generate content');
          this.isScraping.set(false);
        }
      },
      error: (err) => {
        console.error('AI generation error:', err);
        this.scrapingError.set('Unable to connect to AI backend. Make sure backend server is running on http://localhost:3000');
        this.isScraping.set(false);
      }
    });
  }

  /**
   * Capitalize first letter of each word
   */
  private capitalizeWords(text: string): string {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private getCurrentDate(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `Today ${hours}:${minutes}`;
  }
}