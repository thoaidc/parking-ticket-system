import {Routes} from '@angular/router';
import {AuthGuardFn} from '../../core/guards/auth.guard';

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    title: 'Trang chủ',
    pathMatch: 'full',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuardFn]
  }
];
