/**
 * Email Service
 *
 * Manages email operations including:
 * - Email storage and retrieval
 * - Draft management
 * - Label creation and management
 * - User preferences
 * - Email sending
 */

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Email {
  id: number;
  from: string;
  to?: string;
  subject: string;
  preview: string;
  body?: string;
  date: string;
  isRead: boolean;
  avatar: string;
  isFlagged: boolean;
  labels?: string[];
  attachments?: Attachment[];
  isSent?: boolean;
}

export interface Draft {
  id: string;
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  date: string;
  avatar: string;
  labels?: string[];
  attachments?: Attachment[];
  lastSaved?: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  emailsPerPage: number;
  autoSaveDraft: boolean;
  autoSaveInterval: number; // in seconds
  signature: string;
  defaultReplyFormat: 'plain' | 'html';
  showPreview: boolean;
  compactView: boolean;
  notificationsEnabled: boolean;
}

export interface Attachment {
  name: string;
  size: number;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private emails = signal<Email[]>([]);
  private drafts = signal<Draft[]>([]);
  private labels = signal<Label[]>([]);
  private userPreferences = signal<UserPreferences>(this.getDefaultPreferences());

  constructor(private http: HttpClient) {
    this.initializeData();
  }

  /**
   * Initialize service data from localStorage or use defaults
   */
  private initializeData(): void {
    this.loadEmails();
    this.loadDrafts();
    this.loadLabels();
    this.loadUserPreferences();
  }

  /**
   * Load emails from storage
   */
  private loadEmails(): void {
    const stored = localStorage.getItem('email-list');
    if (stored) {
      try {
        this.emails.set(JSON.parse(stored));
      } catch (e) {
        this.emails.set(this.getDefaultEmails());
      }
    } else {
      this.emails.set(this.getDefaultEmails());
      localStorage.setItem('email-list', JSON.stringify(this.getDefaultEmails()));
    }
  }

  /**
   * Load drafts from storage
   */
  private loadDrafts(): void {
    const stored = localStorage.getItem('email-drafts');
    if (stored) {
      try {
        this.drafts.set(JSON.parse(stored));
      } catch (e) {
        this.drafts.set([]);
      }
    }
  }

  /**
   * Load labels from storage
   */
  private loadLabels(): void {
    const stored = localStorage.getItem('email-labels');
    if (stored) {
      try {
        this.labels.set(JSON.parse(stored));
      } catch (e) {
        this.labels.set(this.getDefaultLabels());
      }
    } else {
      this.labels.set(this.getDefaultLabels());
      localStorage.setItem('email-labels', JSON.stringify(this.getDefaultLabels()));
    }
  }

  /**
   * Load user preferences from storage
   */
  private loadUserPreferences(): void {
    const stored = localStorage.getItem('email-preferences');
    if (stored) {
      try {
        const prefs = JSON.parse(stored);
        this.userPreferences.set({ ...this.getDefaultPreferences(), ...prefs });
      } catch (e) {
        this.userPreferences.set(this.getDefaultPreferences());
      }
    }
  }

  /**
   * Get default email list
   */
  private getDefaultEmails(): Email[] {
    return [
      {
        id: 1,
        from: 'john@example.com',
        subject: 'Project Update - Q1 2026',
        preview: 'Great progress on the new email service. The UI components are looking excellent...',
        body: 'Great progress on the new email service. The UI components are looking excellent. The team has been very productive this sprint.',
        date: 'Today 10:30 AM',
        isRead: false,
        avatar: 'JO',
        isFlagged: false,
        labels: ['work'],
        isSent: false
      },
      {
        id: 2,
        from: 'sarah@company.com',
        subject: 'Meeting Scheduled - Next Week',
        preview: 'Following up on our earlier discussion. I\'ve scheduled the team meeting for next Wednesday...',
        body: 'Following up on our earlier discussion. I\'ve scheduled the team meeting for next Wednesday at 2:00 PM. Please confirm your attendance.',
        date: 'Yesterday 2:45 PM',
        isRead: true,
        avatar: 'SA',
        isFlagged: true,
        labels: ['work', 'meetings'],
        isSent: false
      },
      {
        id: 3,
        from: 'team@project.dev',
        subject: 'Weekly Digest - Development Update',
        preview: 'This week\'s development summary: 15 pull requests merged, 23 issues closed, and 5...',
        body: 'This week\'s development summary: 15 pull requests merged, 23 issues closed, and 5 new features implemented.',
        date: 'Feb 2, 2:15 PM',
        isRead: true,
        avatar: 'PD',
        isFlagged: false,
        labels: ['work'],
        isSent: false
      },
      {
        id: 4,
        from: 'notifications@service.com',
        subject: 'System Maintenance Notice',
        preview: 'Scheduled maintenance will occur on February 5th from 2:00 AM to 4:00 AM UTC...',
        body: 'Scheduled maintenance will occur on February 5th from 2:00 AM to 4:00 AM UTC. Services will be temporarily unavailable.',
        date: 'Feb 2, 9:30 AM',
        isRead: true,
        avatar: 'NO',
        isFlagged: false,
        labels: ['notifications'],
        isSent: false
      },
      {
        id: 5,
        from: 'michael@tech.com',
        subject: 'Code Review Request',
        preview: 'Please review the authentication module. I\'ve implemented several security improvements...',
        body: 'Please review the authentication module. I\'ve implemented several security improvements and would appreciate your feedback.',
        date: 'Feb 1, 4:20 PM',
        isRead: true,
        avatar: 'MI',
        isFlagged: true,
        labels: ['work'],
        isSent: false
      },
      {
        id: 6,
        from: 'design@studio.io',
        subject: 'New Design Mockups Ready',
        preview: 'The new dashboard designs are complete. I\'ve uploaded them to the shared folder...',
        body: 'The new dashboard designs are complete. I\'ve uploaded them to the shared folder for your review.',
        date: 'Jan 31, 11:00 AM',
        isRead: true,
        avatar: 'DE',
        isFlagged: false,
        labels: ['design'],
        isSent: false
      }
    ];
  }

  /**
   * Get default labels
   */
  private getDefaultLabels(): Label[] {
    return [
      { id: 'work', name: 'Work', color: '#667eea', icon: '💼' },
      { id: 'personal', name: 'Personal', color: '#f093fb', icon: '👤' },
      { id: 'meetings', name: 'Meetings', color: '#4facfe', icon: '📅' },
      { id: 'design', name: 'Design', icon: '🎨', color: '#fa709a' },
      { id: 'notifications', name: 'Notifications', color: '#30b0fe', icon: '🔔' }
    ];
  }

  /**
   * Get default user preferences
   */
  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'light',
      emailsPerPage: 20,
      autoSaveDraft: true,
      autoSaveInterval: 30,
      signature: 'Best regards,\nYour Name',
      defaultReplyFormat: 'plain',
      showPreview: true,
      compactView: false,
      notificationsEnabled: true
    };
  }

  /**
   * Get all emails
   */
  getEmails() {
    return this.emails.asReadonly();
  }

  /**
   * Get all drafts
   */
  getDrafts() {
    return this.drafts.asReadonly();
  }

  /**
   * Get all labels
   */
  getLabels() {
    return this.labels.asReadonly();
  }

  /**
   * Get user preferences
   */
  getPreferences() {
    return this.userPreferences.asReadonly();
  }

  /**
   * Update user preferences
   */
  updatePreferences(prefs: Partial<UserPreferences>): void {
    const current = this.userPreferences();
    const updated = { ...current, ...prefs };
    this.userPreferences.set(updated);
    localStorage.setItem('email-preferences', JSON.stringify(updated));
  }

  /**
   * Create a new label
   */
  createLabel(name: string, color: string = '#667eea', icon: string = '🏷️'): Label {
    const newLabel: Label = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      color,
      icon
    };
    const current = this.labels();
    this.labels.set([...current, newLabel]);
    localStorage.setItem('email-labels', JSON.stringify(this.labels()));
    return newLabel;
  }

  /**
   * Delete a label
   */
  deleteLabel(labelId: string): void {
    const current = this.labels();
    this.labels.set(current.filter(l => l.id !== labelId));
    localStorage.setItem('email-labels', JSON.stringify(this.labels()));

    // Remove label from all emails and drafts
    const emails = this.emails();
    this.emails.set(
      emails.map(e => ({
        ...e,
        labels: e.labels?.filter(l => l !== labelId)
      }))
    );
    localStorage.setItem('email-list', JSON.stringify(this.emails()));

    const drafts = this.drafts();
    this.drafts.set(
      drafts.map(d => ({
        ...d,
        labels: d.labels?.filter(l => l !== labelId)
      }))
    );
    localStorage.setItem('email-drafts', JSON.stringify(this.drafts()));
  }

  /**
   * Save a draft email
   */
  saveDraft(draft: Draft): void {
    const existing = this.drafts().find(d => d.id === draft.id);
    const updated = {
      ...draft,
      lastSaved: new Date().toLocaleString()
    };

    if (existing) {
      const drafts = this.drafts().map(d => (d.id === draft.id ? updated : d));
      this.drafts.set(drafts);
    } else {
      this.drafts.set([...this.drafts(), updated]);
    }

    localStorage.setItem('email-drafts', JSON.stringify(this.drafts()));
  }

  /**
   * Delete a draft
   */
  deleteDraft(draftId: string): void {
    const drafts = this.drafts();
    this.drafts.set(drafts.filter(d => d.id !== draftId));
    localStorage.setItem('email-drafts', JSON.stringify(this.drafts()));
  }

  /**
   * Send an email (creates a sent email record)
   */
  sendEmail(draft: Draft): Promise<any> {
    const sentEmail: Email = {
      id: Date.now(),
      from: 'you@example.com',
      to: draft.to,
      subject: draft.subject,
      preview: draft.body.substring(0, 100),
      body: draft.body,
      date: new Date().toLocaleString(),
      isRead: true,
      avatar: 'YO',
      isFlagged: false,
      labels: draft.labels,
      isSent: true
    };

    return this.http.post<any>('/api/send-email', sentEmail).toPromise().then(res => {
      // Store sent email in localStorage
      const sent = localStorage.getItem('email-sent');
      const sentEmails = sent ? JSON.parse(sent) : [];
      sentEmails.push(sentEmail);
      localStorage.setItem('email-sent', JSON.stringify(sentEmails));

      // Delete the draft
      this.deleteDraft(draft.id);

      return res;
    });
  }

  /**
   * Flag/unflag an email
   */
  toggleFlag(emailId: number): void {
    const emails = this.emails();
    const updated = emails.map(e =>
      e.id === emailId ? { ...e, isFlagged: !e.isFlagged } : e
    );
    this.emails.set(updated);
    localStorage.setItem('email-list', JSON.stringify(updated));
  }

  /**
   * Add label to email
   */
  addLabelToEmail(emailId: number, labelId: string): void {
    const emails = this.emails();
    const updated = emails.map(e => {
      if (e.id === emailId) {
        const labels = e.labels || [];
        if (!labels.includes(labelId)) {
          return { ...e, labels: [...labels, labelId] };
        }
      }
      return e;
    });
    this.emails.set(updated);
    localStorage.setItem('email-list', JSON.stringify(updated));
  }

  /**
   * Remove label from email
   */
  removeLabelFromEmail(emailId: number, labelId: string): void {
    const emails = this.emails();
    const updated = emails.map(e =>
      e.id === emailId
        ? { ...e, labels: e.labels?.filter(l => l !== labelId) }
        : e
    );
    this.emails.set(updated);
    localStorage.setItem('email-list', JSON.stringify(updated));
  }
}
