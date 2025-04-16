import {inject} from '@angular/core';
import {
  HttpRequest,
  HttpInterceptorFn,
  HttpHandlerFn
} from '@angular/common/http';
import {EventManager} from '../utils/event-manager.util';

export const ErrorHandlerInterceptorFn: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
   const eventManager = inject(EventManager);

  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   return next.handle(request).pipe(
  //     tap({
  //       error: (err: HttpErrorResponse) => {
  //         if (!(err.status === 401 && (err.message === '' || err.url?.includes('api/account')))) {
  //           this.eventManager.broadcast(new EventWithContent('SmartOtpApp.httpError', err));
  //         }
  //       },
  //     }),
  //   );
  // }

  return next(req);
};
