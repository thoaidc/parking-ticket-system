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

export const ApiInterceptorFn: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn) => {
  const toast = inject(ToastrService);
  const appConfig = inject(ApplicationConfigService);

  const isApiRequest = request.url.startsWith(appConfig.getEndpointFor(''));
  const modifiedReq = isApiRequest ? request.clone({ withCredentials: true }) : request;

  return next(modifiedReq).pipe(
    tap({
      next: () => {},
      error: (error: HttpErrorResponse) => {
        if (request.method !== 'GET' && error.error && error.message) {
          toast.error(error.error.message, 'Thông báo');
        }
      }
    })
  );
};
