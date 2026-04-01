import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmailService, Draft, Label } from '../../core/services/email';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.html',
  styleUrls: ['../../mail/compose/compose.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule] // Imports for template and form handling
})
export class AlertComponent implements OnInit{
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private emailService = inject(EmailService);
  passedSearchTerm: string | null = '';

  ngOnInit() {
    // This pulls the ":term" out of the URL
    this.passedSearchTerm = this.route.snapshot.paramMap.get('term');
  }

  async onCreateAlert() {
    const emailDraft: Draft = {
    id: Date.now().toString(),             // Required by Draft
    to: 'you@example.com',
    cc: '',                     // Required by Draft
    bcc: '',                    // Required by Draft
    subject: `New Alert: ${this.passedSearchTerm}`,
    body: `You created an alert for: ${this.passedSearchTerm}`,
    date: new Date().toISOString(), // Required by Draft
    avatar: 'AL',               // Required by Draft (e.g., initials for Alert)
    labels: ['Alerts']
  };

    try {
      await this.emailService.sendEmail(emailDraft);
      alert('Alert created and confirmation email sent!');
      this.router.navigate(['/search']); // Send them back to search after success
    } catch (error) {
      console.error('Email failed to send', error);
    }
}
}