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
import { AuthService } from './auth';

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
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  date: string;
  avatar: string;
  labels?: string[];
  attachments?: Attachment[];
  lastSaved?: string;
  backendId?: number; // ID from backend for syncing
  preview?: string;
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
  providedIn: 'root',
})
export class EmailService {
  private emails = signal<Email[]>([]);
  private drafts = signal<Draft[]>([]);
  private sentEmails = signal<Email[]>([]);
  private labels = signal<Label[]>([]);
  private userPreferences = signal<UserPreferences>(this.getDefaultPreferences());
  private backendUserId: number | null = null;
  private backendUserIdPromise: Promise<number | null> | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.initializeData();
    void this.loadAndMergeDrafts();
    void this.loadAndMergeSentEmails();
  }

  /**
   * Initialize service data from localStorage or use defaults
   */
  private initializeData(): void {
    this.loadEmails();
    this.loadDrafts();
    this.loadSentEmails();
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
   * Load sent emails from storage
   */
  private loadSentEmails(): void {
    const stored = localStorage.getItem('email-sent');
    if (stored) {
      try {
        this.sentEmails.set(JSON.parse(stored));
      } catch (e) {
        this.sentEmails.set([]);
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
        preview:
          'Great progress on the new email service. The UI components are looking excellent...',
        body: 'Great progress on the new email service. The UI components are looking excellent. The team has been very productive this sprint.',
        date: 'Today 10:30 AM',
        isRead: false,
        avatar: 'JO',
        isFlagged: false,
        labels: ['work'],
        isSent: false,
      },
      {
        id: 2,
        from: 'sarah@company.com',
        subject: 'Meeting Scheduled - Next Week',
        preview:
          "Following up on our earlier discussion. I've scheduled the team meeting for next Wednesday...",
        body: "Following up on our earlier discussion. I've scheduled the team meeting for next Wednesday at 2:00 PM. Please confirm your attendance.",
        date: 'Yesterday 2:45 PM',
        isRead: true,
        avatar: 'SA',
        isFlagged: true,
        labels: ['work', 'meetings'],
        isSent: false,
      },
      {
        id: 3,
        from: 'team@project.dev',
        subject: 'Weekly Digest - Development Update',
        preview:
          "This week's development summary: 15 pull requests merged, 23 issues closed, and 5...",
        body: "This week's development summary: 15 pull requests merged, 23 issues closed, and 5 new features implemented.",
        date: 'Feb 2, 2:15 PM',
        isRead: true,
        avatar: 'PD',
        isFlagged: false,
        labels: ['work'],
        isSent: false,
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
        isSent: false,
      },
      {
        id: 5,
        from: 'michael@tech.com',
        subject: 'Code Review Request',
        preview:
          "Please review the authentication module. I've implemented several security improvements...",
        body: "Please review the authentication module. I've implemented several security improvements and would appreciate your feedback.",
        date: 'Feb 1, 4:20 PM',
        isRead: true,
        avatar: 'MI',
        isFlagged: true,
        labels: ['work'],
        isSent: false,
      },
      {
        id: 6,
        from: 'design@studio.io',
        subject: 'New Design Mockups Ready',
        preview:
          "The new dashboard designs are complete. I've uploaded them to the shared folder...",
        body: "The new dashboard designs are complete. I've uploaded them to the shared folder for your review.",
        date: 'Jan 31, 11:00 AM',
        isRead: true,
        avatar: 'DE',
        isFlagged: false,
        labels: ['design'],
        isSent: false,
      },
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
      { id: 'notifications', name: 'Notifications', color: '#30b0fe', icon: '🔔' },
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
      notificationsEnabled: true,
    };
  }

  private getCurrentUserEmail(): string {
    const currentUser = this.authService.getCurrentUser()?.trim().toLowerCase();

    if (currentUser && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentUser)) {
      return currentUser;
    }

    return 'demo@digiclips.local';
  }

  private getCurrentUserName(): string {
    const email = this.getCurrentUserEmail();
    const localPart = email.split('@')[0] || 'Demo User';

    return localPart
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private getCurrentUserAvatar(): string {
    return this.getCurrentUserName()
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'DU';
  }

  private persistSentEmails(sentEmails: Email[]): void {
    this.sentEmails.set(sentEmails);
    localStorage.setItem('email-sent', JSON.stringify(sentEmails));
  }

  private toSentEmail(record: any): Email {
    return {
      id: record.id ?? Date.now(),
      from: this.getCurrentUserEmail(),
      to: record.to || '',
      subject: record.subject || '(no subject)',
      preview: (record.body || '').substring(0, 100),
      body: record.body || '',
      date: record.createdAt ? new Date(record.createdAt).toLocaleString() : new Date().toLocaleString(),
      isRead: true,
      avatar: this.getCurrentUserAvatar(),
      isFlagged: false,
      labels: [],
      isSent: true,
    };
  }

  private async ensureBackendUserId(): Promise<number | null> {
    if (this.backendUserId) {
      return this.backendUserId;
    }

    if (!this.backendUserIdPromise) {
      this.backendUserIdPromise = this.resolveBackendUserId().finally(() => {
        this.backendUserIdPromise = null;
      });
    }

    return this.backendUserIdPromise;
  }

  private async resolveBackendUserId(): Promise<number | null> {
    try {
      const response = await fetch('/api/users/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.getCurrentUserEmail(),
          name: this.getCurrentUserName(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to resolve backend user (${response.status})`);
      }

      const data = await response.json();
      this.backendUserId = data.user?.id ?? null;
      return this.backendUserId;
    } catch (err) {
      console.error('Failed to resolve backend user:', err);
      return null;
    }
  }

  /**
   * Sync draft to backend (create or update)
   */

  private async syncDraftToBackend(draft: Draft): Promise<void> {
    try {
      const userId = await this.ensureBackendUserId();

      if (!userId) {
        return;
      }

      const payload = {
        userId,
        to: draft.to,
        cc: draft.cc,
        bcc: draft.bcc,
        subject: draft.subject,
        body: draft.body,
      };

      if (!draft.backendId) {
        const res = await fetch('/api/drafts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        draft.backendId = data.draft.id;
      } else {
        await fetch(`/api/drafts/${draft.backendId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
    } catch (err) {
      console.error('Backend draft sync failed:', err);
    }
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
   * Get all sent emails
   */
  getSentEmails() {
    return this.sentEmails.asReadonly();
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
      icon,
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
    this.labels.set(current.filter((l) => l.id !== labelId));
    localStorage.setItem('email-labels', JSON.stringify(this.labels()));

    // Remove label from all emails and drafts
    const emails = this.emails();
    this.emails.set(
      emails.map((e) => ({
        ...e,
        labels: e.labels?.filter((l) => l !== labelId),
      })),
    );
    localStorage.setItem('email-list', JSON.stringify(this.emails()));

    const drafts = this.drafts();
    this.drafts.set(
      drafts.map((d) => ({
        ...d,
        labels: d.labels?.filter((l) => l !== labelId),
      })),
    );
    localStorage.setItem('email-drafts', JSON.stringify(this.drafts()));
  }

  /**
   * Save a draft email
   */
  saveDraft(draft: Draft): void {
    const existing = this.drafts().find((d) => d.id === draft.id);
    const updated = {
      ...draft,
      lastSaved: new Date().toLocaleString(),
    };

    if (existing) {
      const drafts = this.drafts().map((d) => (d.id === draft.id ? updated : d));
      this.drafts.set(drafts);
    } else {
      this.drafts.set([...this.drafts(), updated]);
    }

    localStorage.setItem('email-drafts', JSON.stringify(this.drafts()));

    // NEW: sync to backend
    this.syncDraftToBackend(updated).then(() => {
      const drafts = this.drafts().map((d) =>
        d.id === updated.id ? { ...d, backendId: updated.backendId } : d,
      );
      this.drafts.set(drafts);
      localStorage.setItem('email-drafts', JSON.stringify(this.drafts()));
    });
  }

  /**
   * Delete a draft
   */
  async deleteDraft(draftId: string): Promise<void> {
    const draftToDelete = this.drafts().find((d) => d.id === draftId);

    this.drafts.set(this.drafts().filter((d) => d.id !== draftId));
    localStorage.setItem('email-drafts', JSON.stringify(this.drafts()));

    if (draftToDelete?.backendId) {
      try {
        await fetch(`/api/drafts/${draftToDelete.backendId}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.error('Failed to delete backend draft:', err);
      }
    }
  }

  /**
   * Send an email (creates a sent email record)
   */
  async sendEmail(draft: Draft): Promise<any> {
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
      isSent: true,
    };

    try {
      const userId = await this.ensureBackendUserId();
      const payload = {
        userId: userId || undefined,
        userEmail: this.getCurrentUserEmail(),
        userName: this.getCurrentUserName(),
        to: draft.to,
        cc: draft.cc,
        bcc: draft.bcc,
        subject: draft.subject,
        body: draft.body,
      };

      const res = await this.http.post<any>('/api/send-email', payload).toPromise();
      const persistedSentEmail = res?.email ? this.toSentEmail(res.email) : sentEmail;
      this.persistSentEmails([
        persistedSentEmail,
        ...this.sentEmails().filter((email) => email.id !== persistedSentEmail.id),
      ]);

      // Delete the draft
      await this.deleteDraft(draft.id);

      return res;
    } catch (err) {
      console.error('Failed to send email:', err);
      throw err;
    }
  }

  async fetchBackendDrafts(): Promise<any[]> {
    try {
      const userId = await this.ensureBackendUserId();

      if (!userId) {
        return [];
      }

      const res = await fetch(`/api/users/${userId}/drafts`);
      const data = await res.json();
      return data.drafts || [];
    } catch (err) {
      console.error('Failed to fetch backend drafts:', err);
      return [];
    }
  }

  async loadAndMergeDrafts(): Promise<void> {
    const backendDrafts = await this.fetchBackendDrafts();
    const localDrafts = this.drafts();
    const mergedDrafts = [...localDrafts];

    backendDrafts.forEach((bd: any) => {
      const exists = mergedDrafts.some((d) => d.backendId === bd.id);

      if (!exists) {
        mergedDrafts.push({
          id: 'backend-' + bd.id,
          backendId: bd.id,
          to: bd.to || '',
          cc: bd.cc || '',
          bcc: bd.bcc || '',
          subject: bd.subject || '',
          body: bd.body || '',
          preview: (bd.body || '').substring(0, 100),
          date: new Date(bd.updatedAt).toLocaleString(),
          avatar: 'BE',
          labels: [],
          attachments: [],
          lastSaved: new Date(bd.updatedAt).toLocaleString(),
        });
      }
    });

    this.drafts.set(mergedDrafts);
    localStorage.setItem('email-drafts', JSON.stringify(mergedDrafts));
  }

  async fetchBackendSentEmails(): Promise<any[]> {
    try {
      const userId = await this.ensureBackendUserId();

      if (!userId) {
        return [];
      }

      const res = await fetch(`/api/users/${userId}/emails`);
      const data = await res.json();
      return data.emails || [];
    } catch (err) {
      console.error('Failed to fetch backend sent emails:', err);
      return [];
    }
  }

  async loadAndMergeSentEmails(): Promise<void> {
    const backendSentEmails = await this.fetchBackendSentEmails();
    const mergedSentEmails = [...this.sentEmails()];

    backendSentEmails.forEach((emailRecord: any) => {
      const normalizedEmail = this.toSentEmail(emailRecord);
      const exists = mergedSentEmails.some((email) => email.id === normalizedEmail.id);

      if (!exists) {
        mergedSentEmails.push(normalizedEmail);
      }
    });

    this.persistSentEmails(
      mergedSentEmails.sort(
        (left, right) => new Date(right.date).getTime() - new Date(left.date).getTime(),
      ),
    );
  }

  async deleteSentEmail(emailId: number): Promise<void> {
    this.persistSentEmails(this.sentEmails().filter((email) => email.id !== emailId));

    try {
      await fetch(`/api/emails/${emailId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to delete backend sent email:', err);
    }
  }

  /**
   * Flag/unflag an email
   */
  toggleFlag(emailId: number): void {
    const emails = this.emails();
    const updated = emails.map((e) => (e.id === emailId ? { ...e, isFlagged: !e.isFlagged } : e));
    this.emails.set(updated);
    localStorage.setItem('email-list', JSON.stringify(updated));
  }

  /**
   * Add label to email
   */
  addLabelToEmail(emailId: number, labelId: string): void {
    const emails = this.emails();
    const updated = emails.map((e) => {
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
    const updated = emails.map((e) =>
      e.id === emailId ? { ...e, labels: e.labels?.filter((l) => l !== labelId) } : e,
    );
    this.emails.set(updated);
    localStorage.setItem('email-list', JSON.stringify(updated));
  }
}
