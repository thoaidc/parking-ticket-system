import {
  HttpRequest,
  HttpInterceptorFn,
  HttpHandlerFn
} from '@angular/common/http';
import {inject} from '@angular/core';
import {AlertUtil} from '../utils/alert.util';

export const NotificationInterceptorFn: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const alertService = inject(AlertUtil);

  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   return next.handle(request).pipe(
  //     tap((event: HttpEvent<any>) => {
  //       if (event instanceof HttpResponse) {
  //         let alert: string | null = null;
  //
  //         for (const headerKey of event.headers.keys()) {
  //           if (headerKey.toLowerCase().endsWith('app-alert')) {
  //             alert = event.headers.get(headerKey);
  //           }
  //         }
  //
  //         if (alert) {
  //           this.alertService.addAlert({
  //             type: 'success',
  //             message: alert,
  //           });
  //         }
  //       }
  //     }),
  //   );
  // }

  return next(req);
};
