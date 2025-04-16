import {inject} from '@angular/core';
import {
  HttpRequest,
  HttpInterceptorFn,
  HttpHandlerFn
} from '@angular/common/http';
import {AuthService} from '../services/auth.service';
import {StateStorageService} from '../services/state-storage.service';
import {Router} from '@angular/router';

export const AuthExpiredInterceptorFn: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const stateStorageService = inject(StateStorageService);
  const router = inject(Router);

  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   return next.handle(request).pipe(
  //     tap({
  //       error: (err: HttpErrorResponse) => {
  //         if (err.status === 401 && err.url && !err.url.includes('api/account') && this.accountService.isAuthenticated()) {
  //           this.stateStorageService.storeUrl(this.router.routerState.snapshot.url);
  //           this.loginService.logout();
  //           this.router.navigate(['/login']);
  //         }
  //       },
  //     }),
  //   );
  // }

  return next(req);
};
