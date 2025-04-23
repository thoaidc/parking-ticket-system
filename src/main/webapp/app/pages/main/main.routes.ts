import {Routes} from '@angular/router';
import {AuthGuardFn} from '../../core/guards/auth.guard';

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    title: 'Trang chủ',
    pathMatch: 'full',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'tickets',
    title: 'Thẻ vé xe',
    pathMatch: 'full',
    loadComponent: () => import('./tickets/tickets.component').then(m => m.TicketsComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'admin',
    loadChildren: () => ADMIN_ROUTES,
    canActivate: [AuthGuardFn]
  },
  {
    path: 'ticket-scan-logs',
    title: 'Nhật ký sử dụng thẻ',
    pathMatch: 'full',
    loadComponent: () => import('./reports/ticket-scan-logs/ticket-scan-logs.component').then(m => m.TicketScanLogsComponent),
    canActivate: [AuthGuardFn]
  }
];

export const ADMIN_ROUTES: Routes = [
  {
    path: 'accounts',
    title: 'Quản lý tài khoản',
    pathMatch: 'full',
    loadComponent: () => import('./auth/accounts/accounts.component').then(m => m.AccountsComponent),
    canActivate: [AuthGuardFn]
  },
  {
    path: 'roles',
    title: 'Quản lý vai trò',
    pathMatch: 'full',
    loadComponent: () => import('./auth/roles/roles.component').then(m => m.RolesComponent),
    canActivate: [AuthGuardFn]
  },
];
