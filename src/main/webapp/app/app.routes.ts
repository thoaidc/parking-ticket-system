import {Routes} from '@angular/router';
import {LoginGuardFn} from './core/guards/login.guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Đăng nhập',
    pathMatch: 'full',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [LoginGuardFn]
  },
];
