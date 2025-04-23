import {inject} from '@angular/core';
import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ApplicationConfigService} from '../config/application-config.service';
import {tap} from 'rxjs';
import {API_COMMON_LOGIN} from '../../constants/api.constants';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

export const ApiInterceptorFn: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn) => {
  const toast = inject(ToastrService);
  const appConfig = inject(ApplicationConfigService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const isApiRequest = request.url.startsWith(appConfig.getEndpointFor(''));
  const modifiedReq = isApiRequest ? request.clone({ withCredentials: true }) : request;

  return next(modifiedReq).pipe(
    tap({
      next: () => {},
      error: (error: HttpErrorResponse) => {
        if (error.status == 401 && !error.url?.includes(API_COMMON_LOGIN)) {
          authService.logout();
          router.navigate(['/login']).then();
        }

        if (request.method !== 'GET' && error.error && error.message) {
          toast.error(error.error.message, 'Thông báo');
        }
      }
    })
  );
};
