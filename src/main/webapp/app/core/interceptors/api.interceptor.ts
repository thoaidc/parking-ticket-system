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
import {TranslateService} from '@ngx-translate/core';
import {DEFAULT_LANGUAGE} from '../../constants/locale.constants';

export const ApiInterceptorFn: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn) => {
  const toast = inject(ToastrService);
  const translateService = inject(TranslateService);
  const appConfig = inject(ApplicationConfigService);
  const isApiRequest = request.url.startsWith(appConfig.getEndpointFor(''));
  let modifiedReq = request;

  if (isApiRequest) {
    modifiedReq = request.clone({
      withCredentials: true,
      setHeaders: {
        'Accept-Language': translateService.currentLang || DEFAULT_LANGUAGE
      }
    });
  }

  return next(modifiedReq).pipe(
    tap({
      next: () => {},
      error: (error: HttpErrorResponse) => {
        if (error.error && error.message) {
          toast.error(error.error.message, 'Thông báo');
        }
      }
    })
  );
};
