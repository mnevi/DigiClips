/**
 * Inbox Component
 *
 * Main email inbox with a sleek modern design featuring:
 * - Email list with multiple folders (inbox, starred, drafts, sent)
 * - Label creation and management
 * - Search and filtering
 * - Email operations (flag, delete, archive)
 * - Integration with email service
 */

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { EmailService, Email, Draft, Label } from '../../core/services/email';

type FolderType = 'inbox' | 'starred' | 'drafts' | 'sent';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.html',
  styleUrls: ['./inbox.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class InboxComponent implements OnInit {
  emails = signal<Email[]>([]);
  drafts = signal<Draft[]>([]);
  sentEmails = signal<Email[]>([]);
  labels = signal<Label[]>([]);
  
  searchQuery = '';
  currentUser = signal<string>('');
  selectedEmail = signal<Email | null>(null);
  currentFolder = signal<FolderType>('inbox');
  
  showNewLabelDialog = signal(false);
  newLabelName = '';
  newLabelColor = '#667eea';
  newLabelIcon = '🏷️';

  constructor(
    private router: Router,
    private authService: AuthService,
    private emailService: EmailService
  ) {
    this.currentUser.set(this.authService.getCurrentUser() || 'User');
  }

  ngOnInit() {
    this.loadData();
  }

  /**
   * Load all data from service
   */
  loadData() {
    this.emails.set(this.emailService.getEmails()());
    this.drafts.set(this.emailService.getDrafts()());
    this.labels.set(this.emailService.getLabels()());
    this.loadSentEmails();
  }

  /**
   * Load sent emails from localStorage
   */
  loadSentEmails() {
    const savedSent = localStorage.getItem('email-sent');
    if (savedSent) {
      try {
        this.sentEmails.set(JSON.parse(savedSent));
      } catch (e) {
        this.sentEmails.set([]);
      }
    }
  }

  /**
   * Get filtered emails based on current folder and search
   */
  getFilteredEmails(): Email[] {
    const folder = this.currentFolder();
    let folderEmails: Email[] = [];

    if (folder === 'inbox') {
      folderEmails = this.emails();
    } else if (folder === 'starred') {
      folderEmails = this.emails().filter(e => e.isFlagged);
    } else if (folder === 'sent') {
      folderEmails = this.sentEmails();
    }

    if (!this.searchQuery) {
      return folderEmails;
    }

    const query = this.searchQuery.toLowerCase();
    return folderEmails.filter(
      email =>
        email.from.toLowerCase().includes(query) ||
        email.subject.toLowerCase().includes(query) ||
        email.preview.toLowerCase().includes(query)
    );
  }

  /**
   * Get filtered drafts based on search
   */
  getDrafts(): Draft[] {
    const currentDrafts = this.drafts();
    if (!this.searchQuery) {
      return currentDrafts;
    }
    const query = this.searchQuery.toLowerCase();
    return currentDrafts.filter(
      draft =>
        draft.to.toLowerCase().includes(query) ||
        draft.subject.toLowerCase().includes(query) ||
        draft.body.toLowerCase().includes(query)
    );
  }

  /**
   * Get emails for a specific label
   */
  getEmailsByLabel(labelId: string): Email[] {
    return this.emails().filter(e => e.labels?.includes(labelId));
  }

  /**
   * Select a folder
   */
  selectFolder(folder: FolderType) {
    this.currentFolder.set(folder);
    this.closeEmail();
  }

  /**
   * Get count of starred emails
   */
  getStarredCount(): number {
    return this.emails().filter(e => e.isFlagged === true).length;
  }

  /**
   * Convert draft to email for viewing
   */
  draftToEmail(draft: Draft): Email {
    return {
      id: parseInt(draft.id.replace('draft-', ''), 10),
      from: draft.to,
      subject: draft.subject,
      preview: draft.body.substring(0, 100),
      body: draft.body,
      date: draft.date,
      isRead: true,
      avatar: draft.avatar,
      isFlagged: false,
      labels: draft.labels
    };
  }

  /**
   * Select an email to view
   */
  selectEmail(email: Email) {
    email.isRead = true;
    this.selectedEmail.set(email);
    this.emails.set([...this.emails()]);
  }

  /**
   * Close email detail view
   */
  closeEmail() {
    this.selectedEmail.set(null);
  }

  /**
   * Navigate to compose
   */
  composeEmail() {
    this.router.navigate(['/mail/compose']);
  }

  /**
   * Navigate to settings
   */
  openSettings() {
    this.router.navigate(['/mail/settings']);
  }

  /**
   * Logout
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Delete an email
   */
  deleteEmail(email: Email) {
    const folder = this.currentFolder();
    if (folder === 'sent') {
      const sent = this.sentEmails();
      this.sentEmails.set(sent.filter(e => e.id !== email.id));
      localStorage.setItem('email-sent', JSON.stringify(this.sentEmails()));
    } else {
      const emails = this.emails();
      this.emails.set(emails.filter(e => e.id !== email.id));
    }
    this.closeEmail();
  }

  /**
   * Delete a draft
   */
  deleteDraft(draft: Draft) {
    this.emailService.deleteDraft(draft.id);
    this.drafts.set(this.emailService.getDrafts()());
  }

  /**
   * Toggle flag on email
   */
  flagEmail(email: Email) {
    this.emailService.toggleFlag(email.id);
    this.emails.set(this.emailService.getEmails()());
  }

  /**
   * Add label to email
   */
  addLabelToEmail(email: Email, labelId: string) {
    this.emailService.addLabelToEmail(email.id, labelId);
    this.emails.set(this.emailService.getEmails()());
  }

  /**
   * Remove label from email
   */
  removeLabelFromEmail(email: Email, labelId: string) {
    this.emailService.removeLabelFromEmail(email.id, labelId);
    this.emails.set(this.emailService.getEmails()());
  }

  /**
   * Toggle new label dialog
   */
  toggleNewLabelDialog() {
    this.showNewLabelDialog.set(!this.showNewLabelDialog());
  }

  /**
   * Create a new label
   */
  createNewLabel() {
    if (!this.newLabelName.trim()) {
      alert('Label name is required');
      return;
    }

    this.emailService.createLabel(this.newLabelName, this.newLabelColor, this.newLabelIcon);
    this.labels.set(this.emailService.getLabels()());
    this.newLabelName = '';
    this.newLabelColor = '#667eea';
    this.newLabelIcon = '🏷️';
    this.toggleNewLabelDialog();
  }

  /**
   * Delete a label
   */
  deleteLabel(labelId: string) {
    if (confirm('Are you sure you want to delete this label? It will be removed from all emails.')) {
      this.emailService.deleteLabel(labelId);
      this.labels.set(this.emailService.getLabels()());
      this.emails.set(this.emailService.getEmails()());
    }
  }

  /**
   * Get label by ID
   */
  getLabel(labelId: string): Label | undefined {
    return this.labels().find(l => l.id === labelId);
  }

  /**
   * Get initials from name
   */
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}

