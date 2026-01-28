import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { AuthGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'mail',
    canActivate: [AuthGuard],
    loadChildren: () => import('./mail/mail-module').then(m => m.MailModule)
  },
  { path: '', redirectTo: 'mail', pathMatch: 'full' }
];