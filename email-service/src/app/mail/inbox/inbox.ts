/**
 * Inbox Component
 *
 * Main email inbox view displaying a list of emails with:
 * - Email list with senders and previews
 * - Compose button for new emails
 * - Search and filter functionality
 * - Responsive design for mobile and desktop
 */

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

interface Email {
  id: number;
  from: string;
  subject: string;
  preview: string;
  date: string;
  isRead: boolean;
  avatar: string;
}

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.html',
  styleUrls: ['./inbox.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class InboxComponent implements OnInit {
  emails = signal<Email[]>([]);
  searchQuery = '';
  currentUser = signal<string>('');
  selectedEmail = signal<Email | null>(null);

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.currentUser.set(this.authService.getCurrentUser() || 'User');
  }

  ngOnInit() {
    this.loadEmails();
  }

  loadEmails() {
    // Mock email data
    const mockEmails: Email[] = [
      {
        id: 1,
        from: 'john@example.com',
        subject: 'Project Update - Q1 2026',
        preview: 'Great progress on the new email service. The UI components are looking excellent...',
        date: 'Today 10:30 AM',
        isRead: false,
        avatar: 'JO'
      },
      {
        id: 2,
        from: 'sarah@company.com',
        subject: 'Meeting Scheduled - Next Week',
        preview: 'Following up on our earlier discussion. I\'ve scheduled the team meeting for next Wednesday...',
        date: 'Yesterday 2:45 PM',
        isRead: true,
        avatar: 'SA'
      },
      {
        id: 3,
        from: 'team@project.dev',
        subject: 'Weekly Digest - Development Update',
        preview: 'This week\'s development summary: 15 pull requests merged, 23 issues closed, and 5...',
        date: 'Feb 2, 2:15 PM',
        isRead: true,
        avatar: 'PD'
      },
      {
        id: 4,
        from: 'notifications@service.com',
        subject: 'System Maintenance Notice',
        preview: 'Scheduled maintenance will occur on February 5th from 2:00 AM to 4:00 AM UTC...',
        date: 'Feb 2, 9:30 AM',
        isRead: true,
        avatar: 'NO'
      },
      {
        id: 5,
        from: 'michael@tech.com',
        subject: 'Code Review Request',
        preview: 'Please review the authentication module. I\'ve implemented several security improvements...',
        date: 'Feb 1, 4:20 PM',
        isRead: true,
        avatar: 'MI'
      },
      {
        id: 6,
        from: 'design@studio.io',
        subject: 'New Design Mockups Ready',
        preview: 'The new dashboard designs are complete. I\'ve uploaded them to the shared folder...',
        date: 'Jan 31, 11:00 AM',
        isRead: true,
        avatar: 'DE'
      }
    ];
    this.emails.set(mockEmails);
  }

  getFilteredEmails(): Email[] {
    if (!this.searchQuery) {
      return this.emails();
    }
    const query = this.searchQuery.toLowerCase();
    return this.emails().filter(
      email =>
        email.from.toLowerCase().includes(query) ||
        email.subject.toLowerCase().includes(query) ||
        email.preview.toLowerCase().includes(query)
    );
  }

  selectEmail(email: Email) {
    email.isRead = true;
    this.selectedEmail.set(email);
  }

  closeEmail() {
    this.selectedEmail.set(null);
  }

  composeEmail() {
    this.router.navigate(['/mail/compose']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  deleteEmail(email: Email) {
    const emails = this.emails();
    const index = emails.indexOf(email);
    if (index > -1) {
      this.emails.set(emails.filter(e => e.id !== email.id));
      this.closeEmail();
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }
}
