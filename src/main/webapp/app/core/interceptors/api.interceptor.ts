import {inject} from '@angular/core';
import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {ApplicationConfigService} from '../config/application-config.service';
import {API_COMMON_LOGIN} from '../../constants/api.constants';
import {tap} from 'rxjs';

export const ApiInterceptorFn: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn) => {
  const toast = inject(ToastrService);
  const router = inject(Router);
  const authService = inject(AuthService);
  const appConfig = inject(ApplicationConfigService);

  const isApiRequest = request.url.startsWith(appConfig.getEndpointFor(''));
  const modifiedReq = isApiRequest ? request.clone({ withCredentials: true }) : request;

  return next(modifiedReq).pipe(
    tap({
      next: () => {},
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          if (request.method !== 'GET') {
            if (error.error && !error.error.status && error.error.message && !error.url?.includes(API_COMMON_LOGIN)) {
              toast.error(error.error.message, 'Thông báo');
            }
          }

          if (error.status === 401) {
            authService.logout();
            router.navigate(['login']).then();
          }
        }
      },
    })
  );
};
