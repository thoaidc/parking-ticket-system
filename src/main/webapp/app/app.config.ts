import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {
  provideHttpClient,
  withInterceptors,
  HttpInterceptorFn,
  HttpInterceptor,
  HttpClient,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  withFetch
} from '@angular/common/http';
import {AuthExpiredInterceptorFn} from './core/interceptors/auth-expired.interceptor';
import {ErrorHandlerInterceptorFn} from './core/interceptors/error-handler.interceptor';
import {NotificationInterceptorFn} from './core/interceptors/notification.interceptor';
import {ApiInterceptorFn} from './core/interceptors/api.interceptor';
import {ResponseInterceptorFn} from './core/interceptors/response.interceptor';

/**
 * {@link provideHttpClient} configure HTTP Interceptors in Angular
 *
 * Functional interceptors are defined using the {@link HttpInterceptorFn} type
 * instead of implementing the {@link HttpInterceptor} interface
 *
 * Interceptors only work with HTTP requests made through Angular's {@link HttpClient}:
 *    - They do not work with {@link fetch()} or native {@link XMLHttpRequest}
 *    - When using {@link fetch()} or {@link XMLHttpRequest}, you need to manually add logic to ensure correct behavior
 *      (e.g., adding a token to the request, etc.)
 *
 * An Interceptor is a function used to intercept the HTTP request and response flow:
 *    - Before the request is sent ({@link HttpRequest})
 *    - After the response is received or in case of an error ({@link HttpResponse} / {@link HttpErrorResponse})
 *
 * Angular will combine all interceptors into a single processing chain (pipeline)
 *
 * In Angular 17+ / 18 (with Standalone API), interceptors do not need to be declared in `AppModule`:
 *    - Instead, interceptors are configured in {@link ApplicationConfig} within {@link appConfig.providers}.
 *
 * Execution order:
 *    - For **requests**: interceptors at the beginning of the array run first
 *    - For **responses**: interceptors at the end of the array run first
 *
 * Therefore, order interceptors by their role:
 *    - {@link AuthExpiredInterceptorFn}: Handle expired authentication
 *    - {@link ErrorHandlerInterceptorFn}: Handle global errors
 *    - {@link NotificationInterceptorFn}: Display notifications
 *    - {@link ApiInterceptorFn}: Logging / modify URLs
 *    - {@link ResponseInterceptorFn}:
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(
      withFetch(), // To let HttpClient use Fetch API instead of XMLHttpRequest (XHR)
      withInterceptors([
        AuthExpiredInterceptorFn,
        ErrorHandlerInterceptorFn,
        NotificationInterceptorFn,
        ApiInterceptorFn,
        ResponseInterceptorFn
      ])
    )
  ]
}
