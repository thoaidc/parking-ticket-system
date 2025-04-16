import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { Observable, of, ReplaySubject } from 'rxjs';
// import { catchError, shareReplay, tap } from 'rxjs/operators';

// import { ApplicationConfigService } from '../config/application-config.service';
// import { Account } from './account.model';
// import { StateStorageService } from './state-storage.service';
// import { LocalStorageService } from 'ngx-webstorage';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // private userIdentity: Account | null = null;
  // private authenticationState = new ReplaySubject<Account | null>(1);
  // private accountCache$?: Observable<Account> | null;
  //
  // constructor(
  //   private http: HttpClient,
  //   private stateStorageService: StateStorageService,
  //   private router: Router,
  //   private applicationConfigService: ApplicationConfigService,
  //   private localStorageService: LocalStorageService,
  // ) {}
  //
  // authenticate(identity: Account | null): void {
  //   this.userIdentity = identity;
  //   this.authenticationState.next(this.userIdentity);
  //   if (!identity) {
  //     this.accountCache$ = null;
  //   }
  // }
  //
  // hasAnyAuthority(authorities: string[] | string): boolean {
  //   if (!this.userIdentity) {
  //     return false;
  //   }
  //   if (!Array.isArray(authorities)) {
  //     authorities = [authorities];
  //   }
  //   return this.userIdentity.authorities.some((authority: string) => authorities.includes(authority));
  // }
  //
  // hasJhiAnyAuthority(authorities: string[] | string): boolean {
  //   let role = this.localStorageService.retrieve('roles');
  //
  //   if (!role) {
  //     this.fetch().subscribe(res => {
  //       role = res.data;
  //       this.localStorageService.store('roles', role);
  //
  //       if (!Array.isArray(authorities)) {
  //         authorities = [authorities];
  //       }
  //       return role.some((authority: string) => authorities.includes(authority));
  //     });
  //     return true;
  //   } else {
  //     if (!Array.isArray(authorities)) {
  //       authorities = [authorities];
  //     }
  //     return role.some((authority: string) => authorities.includes(authority));
  //   }
  // }
  //
  // identity(force?: boolean): Observable<Account | null> {
  //   if (!this.accountCache$ || force) {
  //     this.accountCache$ = this.fetch().pipe(
  //       tap((account: Account) => {
  //         this.authenticate(account);
  //
  //         this.navigateToStoredUrl();
  //       }),
  //       shareReplay(),
  //     );
  //   }
  //   return this.accountCache$.pipe(catchError(() => of(null)));
  // }
  //
  isAuthenticated(): boolean {
    return true;
  }
  //
  // getAuthenticationState(): Observable<Account | null> {
  //   return this.authenticationState.asObservable();
  // }
  //
  // private fetch(): Observable<any> {
  //   return this.http.get<any>(this.applicationConfigService.getEndpointFor('api/common/login-permision'));
  // }
  //
  // private navigateToStoredUrl(): void {
  //   // previousState can be set in the authExpiredInterceptor and in the userRouteAccessService
  //   // if login is successful, go to stored previousState and clear previousState
  //   const previousUrl = this.stateStorageService.getUrl();
  //   if (previousUrl) {
  //     this.stateStorageService.clearUrl();
  //     this.router.navigateByUrl(previousUrl);
  //   }
  // }
}
