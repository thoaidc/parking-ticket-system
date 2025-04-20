import {inject} from '@angular/core';
import {
  HttpRequest,
  HttpInterceptorFn,
  HttpHandlerFn, HttpErrorResponse
} from '@angular/common/http';
import {EventManager} from '../utils/event-manager.util';
import {API_COMMON_LOGIN} from '../../constants/api.constants';
import {tap} from 'rxjs';

export const ErrorHandlerInterceptorFn: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const eventManager = inject(EventManager);

  return next(req).pipe(
    tap({
      error: (err: HttpErrorResponse) => {
        if (!(err.status === 401 && (err.message === '' || err.url?.includes(API_COMMON_LOGIN)))) {
          eventManager.broadcast({name: 'dct.appError', content: err});
        }
      },
    }),
  );
};
