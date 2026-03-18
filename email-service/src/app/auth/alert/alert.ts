import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EmailService, Draft, Label } from '../../core/services/email';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.html',
  styleUrls: ['../../mail/compose/compose.scss'],
  standalone: true,
  imports: [CommonModule] // Imports for template and form handling
})
export class AlertComponent {}