import {inject} from '@angular/core';
import {
  HttpRequest,
  HttpInterceptorFn,
  HttpHandlerFn, HttpErrorResponse
} from '@angular/common/http';
import {AuthService} from '../services/auth.service';
import {StateStorageService} from '../services/state-storage.service';
import {Router} from '@angular/router';
import {tap} from 'rxjs';
import {API_COMMON_LOGIN} from '../../constants/api.constants';

export const AuthExpiredInterceptorFn: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const stateStorageService = inject(StateStorageService);
  const router = inject(Router);

  return next(req).pipe(
    tap({
      error: (err: HttpErrorResponse) => {
        if (err.status === 401 && err.url && !err.url.includes(API_COMMON_LOGIN) && authService.isAuthenticated()) {
          stateStorageService.savePreviousPage(router.routerState.snapshot.url);
          authService.logout();
          router.navigate(['login']).then();
        }
      },
    })
  );
};
