import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.html',
  styleUrls: ['./alert.scss'],
  standalone: true,
  imports: [CommonModule] // Imports for template and form handling
})
export class AlertComponent {}