/**
 * Mail Module
 * 
 * Feature module that encapsulates all email-related functionality.
 * 
 * Responsibilities:
 * - Provide email inbox, compose, and read views
 * - Manage email data and operations
 * - Handle email-specific routing
 * 
 * Lazy Loading:
 * - This module is lazy-loaded via route: /mail
 * - Loaded on-demand only when user accesses email feature
 * - Reduces initial application bundle size
 * - Improves application startup performance
 * 
 * Route Protection:
 * - Access protected by AuthGuard
 * - Only authenticated users can load this module
 * - Unauthenticated users redirected to /login
 * 
 * Route Configuration:
 * - Parent route: /mail
 * - Module loaded dynamically via:
 *   loadChildren: () => import('./mail/mail-module').then(m => m.MailModule)
 * 
 * Current Status:
 * - Placeholder module (empty declarations and imports)
 * - Ready for feature expansion
 * 
 * Planned Features:
 * - ✅ Mail inbox component with email list
 * - ✅ Email compose component
 * - ✅ Email read/detail view
 * - ✅ Email search and filtering
 * - ✅ Email attachment handling
 * - ✅ Folder organization (sent, drafts, trash, etc.)
 * - ✅ Real-time email notifications
 * - ✅ Email sync service
 * 
 * Sub-Routes (to be implemented):
 * - /mail/inbox: Inbox view
 * - /mail/compose: New email composition
 * - /mail/:id: Email detail/read view
 * - /mail/sent: Sent emails folder
 * - /mail/drafts: Draft emails folder
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InboxComponent } from './inbox/inbox';

const routes: Routes = [
  {
    path: 'inbox',
    component: InboxComponent
  },
  {
    path: '',
    redirectTo: 'inbox',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MailModule { }
