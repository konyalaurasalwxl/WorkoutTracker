
import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { PlansComponent } from './pages/plans/plans';
import { ProfileComponent } from './pages/profile/profile';
import { SettingsComponent } from './pages/settings/settings';
import { Error404Component } from './pages/error404/error404';
import { AuthComponent } from './pages/auth/auth.component'; 
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: 'auth', component: AuthComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'plans', component: PlansComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
  { path: '**', component: Error404Component, canActivate: [authGuard] }
];