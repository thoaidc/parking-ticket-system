import {Injectable} from '@angular/core';
import {Account} from '../models/account.model';
import {catchError, map, Observable, of, ReplaySubject, shareReplay, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {StateStorageService} from './state-storage.service';
import {Router} from '@angular/router';
import {ApplicationConfigService} from '../config/application-config.service';
import {
  API_COMMON_CHECK_AUTHENTICATION_STATUS,
  API_COMMON_LOGIN,
  API_COMMON_LOGOUT
} from '../../constants/api.constants';
import {LoginRequest} from '../models/login.model';
import {BaseResponse} from '../models/response.model';
import {filter} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthService {
  private userIdentity: Account | null = null;
  private accountCache$: Observable<Account> | null = null;
  private authenticationState = new ReplaySubject<Account | null>(1);

  constructor(
    private router: Router,
    private http: HttpClient,
    private stateStorageService: StateStorageService,
    private applicationConfigService: ApplicationConfigService
  ) {}

  authenticate(loginRequest?: LoginRequest, forceLogin?: boolean): Observable<Account | null> {
    if (!this.accountCache$ || forceLogin) {
      this.accountCache$ = this.checkAuthenticateFromBe(loginRequest).pipe(
        catchError(() => {
          this.setAuthenticationState(null);
          return of(null);
        }),
        tap((account: Account | null) => this.setAuthenticationState(account)),
        filter((account): account is Account => account !== null),
        shareReplay()
      );
    }

    return this.accountCache$;
  }

  hasAllAuthorities(authorities: string[] | string): boolean {
    if (!this.userIdentity || !this.userIdentity.authorities) {
      return false;
    }

    const requiredAuthorities = Array.isArray(authorities) ? authorities : [authorities];

    return requiredAuthorities.every(required => this.userIdentity!.authorities?.includes(required));
  }

  isAuthenticated(): boolean {
    return this.userIdentity !== null;
  }

  subscribeAuthenticationState(): Observable<Account | null> {
    return this.authenticationState.asObservable();
  }

  logout(): Observable<boolean> {
    const apiUrl = this.applicationConfigService.getEndpointFor(API_COMMON_LOGOUT);

    return this.http.post<BaseResponse<any>>(apiUrl, {}).pipe(
      map(response => {
        if (response.status) {
          this.setAuthenticationState(null);
          return true;
        }

        return false;
      }),
      catchError(() => of(false))
    );
  }

  private checkAuthenticateFromBe(loginRequest?: LoginRequest): Observable<Account | null> {
    const apiUrl = this.applicationConfigService.getEndpointFor(API_COMMON_LOGIN);
    const apiStatusUrl = this.applicationConfigService.getEndpointFor(API_COMMON_CHECK_AUTHENTICATION_STATUS);
    const url = loginRequest ? apiUrl : apiStatusUrl;
    const requestBody = loginRequest ? loginRequest: {};

    return this.http.post<BaseResponse<Account>>(url, requestBody).pipe(
      map(response => {
        if (response.status && response.result) {
          return response.result as Account;
        }

        return null;
      }),
      catchError(() => of(null))
    );
  }

  private setAuthenticationState(account: Account | null) {
    this.userIdentity = account;
    this.authenticationState.next(account);

    if (account) {
      this.navigateToPreviousPage();
    } else {
      this.accountCache$ = null;
    }
  }

  /**
   * Redirect to the page the user previously requested <p>
   * Previous page url can be set in the {@link AuthExpiredInterceptorFn} <p>
   * After login successfully, navigate to this page and clear old data
   * @private
   */
  private navigateToPreviousPage(): void {
    const previousUrl = this.stateStorageService.getPreviousPage();

    if (previousUrl) {
      this.stateStorageService.clearPreviousPage();
      this.router.navigateByUrl(previousUrl).then();
    }
  }
}
