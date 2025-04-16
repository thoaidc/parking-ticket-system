import {inject} from '@angular/core';
import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

export const ApiInterceptorFn: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  // const loading = inject(LoadingOption);
  const toast = inject(ToastrService);
  const router = inject(Router);
  const loginService = inject(AuthService);

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   this.loading.isLoading = true;
  //
  //   return next.handle(req).pipe(
  //     tap(
  //       event => {
  //         if (event instanceof HttpResponse) {
  //           this.loading.isLoading = false;
  //         }
  //       },
  //       error => {
  //         if (error instanceof HttpErrorResponse) {
  //           this.loading.isLoading = false;
  //           if (!(req.method === 'GET')) {
  //             if (error.error && !error.error.status && error.error.message && !error.url?.includes(LOGIN)) {
  //               this.toast.error(error.error.message, 'Thông báo');
  //             }
  //           }
  //           if (error.status == 401) {
  //             this.loginService.logout();
  //             this.router.navigate(['/login']);
  //           }
  //         }
  //       },
  //     ),
  //   );
  // }
  return next(req);
};
