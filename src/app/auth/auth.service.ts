import { SessionStorageService, LocalStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { CredentialResponse } from './../models/auth/credentialResponse';
import { Injectable } from '@angular/core';
import { Credential } from '../models/auth/credential';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiUrls, BASE_URLS_FOR_ROLES, ActiveUrls } from './activeUrls';
import { ROLE, ROLE_MAPPER } from './role';
import { Authority } from '../models/auth/authority';
import { VerificationRequest } from '../models/auth/verificationRequest';
import { BaseHandlerService } from '../common/services/service.base.handler';
import { OAuthProvider } from '../models/auth/oAuthProvider';
import { FailedRegistrationData } from '../models/common/failedRegistrationData';
import { StatusUser } from '../models/auth/statusUser';
import { SurveyResult } from '../models/survey/surveyResult';
import { BackUrlLevel } from '../components/shared-module/common/backUrlLevel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static backUrlName = 'back_url';
  static SCROLL_VALUE = 'SCROLL_VALUE';
  static TIME_NEXT_SHOW_OFFER = 'TIME_NEXT_SHOW_OFFER';
  static INTERVAL_SHOW_OFFER = 30;
  static FIELD_ACTIVITY_ID = 'field_Activity_Id';
  static CHOOSEN_VACANCY = 'choosen_vacancy';
  static GENERAL_NAV = 'general_nav';
  static CREATE_RESUME = 'create_resume';

  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private router: Router,
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private sessionStorage: SessionStorageService) {
      const auth = this.sessionStorage.get('auth');
      this.loggedIn.next(this.isAuthNotEmpty(auth));
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get LoggedUser(): CredentialResponse {
    const auth = this.sessionStorage.get('auth');
    const authLocal = this.localStorageService.get('auth');
    if(auth == null || auth == "") {
      if(authLocal == null) {
        return new CredentialResponse();
      }
      else {
        this.updateAuth(authLocal);
        this.loggedIn.next(true);
        return authLocal;
      }
    }

    return JSON.parse(auth);
  }

  isUser(): boolean {
    return this.LoggedUser.authorities.filter((auth: Authority) => {
      return auth.authority == ROLE.PARTNER || auth.authority == ROLE.PERFORMER;
    }).length != 0;
  }

  isLegalEntityFull(): boolean {
    return this.LoggedUser.authorities.filter((auth: Authority) => {
      return auth.authority == ROLE.LEGAL_ENTITY_FULL;
    }).length != 0;
  }

  isAdmin(): boolean {
    return this.LoggedUser.authorities.filter((auth: Authority) => {
      return auth.authority == ROLE.SUPER_USER;
    }).length != 0;
  }

  isBadPerformer(): boolean {
    return this.LoggedUser.authorities.filter((auth: Authority) => {
      return auth.authority == ROLE.BAD_PERFORMER;
    }).length != 0;
  }

  isBadPartner(): boolean {
    return this.LoggedUser.authorities.filter((auth: Authority) => {
      return auth.authority == ROLE.BAD_PARTNER;
    }).length != 0;
  }

  isMember(): boolean {
    return this.LoggedUser.authorities.filter((auth: Authority) => {
      return auth.authority == ROLE.MEMBER_ANOTHER || auth.authority == ROLE.MEMBER_PERFORMER || auth.authority == ROLE.MEMBER_STORE;
    }).length != 0;
  }
  isStatusNotVerify(): boolean {
    return this.LoggedUser.statusUser == StatusUser.NOT_VERIFY;
  }

  isNotShowOfferLoadApp(): boolean {
    return this.LoggedUser.notShowOfferLoadApp;
  }

  isMobileMode(): boolean {
    let user = navigator.userAgent.toLowerCase();
    return user.indexOf("ipad") != -1 || user.indexOf("iphone") != -1 || user.indexOf("android") != -1
  }

  get getCurrentId(): number {
    return this.LoggedUser.creatorId;
  }

  get getUserId(): number {
    return this.LoggedUser.userId;
  }

  static checkAuthUser(auth: CredentialResponse, role: string): boolean {
    let access = false;
    if (auth != null && auth.authorities !== null) {
      auth.authorities.some((el) => {
        //console.log('el.authority: ' + el.authority);
        access = el.authority === role;
        return access;
      });
    }
    return access;
  }

  static checkSection(url: string, section: string[]): boolean {
    let result: boolean;
    section.forEach(el => {
      url.indexOf(el) == 0 ? result = true : result = false;
    })
    return result;
  }

  updateNotShowOfferLoadApp() {
    const response: CredentialResponse = this.LoggedUser;
    response.notShowOfferLoadApp = true;
    this.updateAuth(response);
  }

  updateStatus(statusUser: StatusUser) {
    const response: CredentialResponse = this.LoggedUser;
    response.statusUser = statusUser;
    this.updateAuth(response);
  }

  updateRoles(roles: ROLE[]) {
    const response: CredentialResponse = this.LoggedUser;
    response.authorities = [];
    roles.forEach((el: ROLE) => {
      response.authorities.push({ authority: el });
    });
    this.updateAuth(response);
  }

  updateRolesForBlocking(roles: ROLE[]) {
    const response: CredentialResponse = this.LoggedUser;
    roles.forEach((el: ROLE) => {
      response.authorities.push({ authority: el });
    });
    this.updateAuth(response);
  }

  authenticate(crdls: Credential, failureHandler) {
    const headers = new HttpHeaders(crdls ? {
      authorization: 'Basic ' + btoa(crdls.username + ':' + crdls.password)
    } : {});
    this.authentication(headers).subscribe((data: CredentialResponse) => {
      if (data != null) {
        this.responseProcessing(data, failureHandler);
      }
    });
  }

  authenticateProvide(provide: OAuthProvider, authToken: string) {
    this.authenticationProvide(provide, authToken).subscribe((data: CredentialResponse) => {
      if (data != null) {
        this.responseProcessing(data, null);
      }
    });
  }

  private responseProcessing(data, failureHandler) {
    const response: CredentialResponse = CredentialResponse.convertToObj(data);
    if(response.authenticated == true) {
      this.updateAuth(response);
      this.loggedIn.next(true);
      const backUrl = this.sessionStorage.get(AuthService.backUrlName);
      if(backUrl == null || backUrl == '') {
        this.redirectToMainProfileByRole(response);
      }
      else {
        this.sessionStorage.remove(AuthService.backUrlName);
        if(backUrl == BackUrlLevel.OTHER_PROVIDE || backUrl == BackUrlLevel.OWNER_APP) {
          window.history.go(backUrl);
        }
        else {
          this.router.navigate([backUrl]);
        }
      }
      return true;
    }
    // @ts-ignore
    else if(data.errorStatus != null) {
      failureHandler();
    }
  }

  private updateAuth(response: CredentialResponse) {
    this.sessionStorage.set('auth', JSON.stringify(response));
    this.localStorageService.set('auth', response);
  }

  private redirectToMainProfileByRole(credential: CredentialResponse) {
    for (let role in ROLE) {
      if(AuthService.checkAuthUser(credential, ROLE_MAPPER[role])) {
        let url = BASE_URLS_FOR_ROLES[role];
        if(role != ROLE.SUPER_USER) {
          url += '/' + credential.creatorId;
          window.location.href = `${window.location.protocol}//${window.location.host}${url}`;
        }
        else{
          window.location.href = `${window.location.protocol}//${window.location.host}${url[0]}`;
        }
        //this.router.navigate([url]);
        break;
      }
    }
  }

  logoutWithoutRedirect() {
    this.clearLoginData();
    this.http.post(ApiUrls.LOGOUT_ACT, {}).subscribe(response => {
    });
  }

  logout() {
    this.clearLoginData();
    this.http.post(ApiUrls.LOGOUT_ACT, {}).subscribe(response => {
      this.router.navigateByUrl('/login');
    });
  }

  clearLoginData() {
    this.loggedIn.next(false);
    this.sessionStorage.remove('auth');
    this.localStorageService.remove('auth');
  }

  navigateToProfile() {
    const auth = this.sessionStorage.get('auth');
    if(this.isAuthNotEmpty(auth)) {
      this.redirectToMainProfileByRole(JSON.parse(auth));
    }
  }

  navigateToAdminUsers() {
    this.router.navigate([ActiveUrls.ADMIN_USERS]);
  }

  navigateToAdminCategories() {
    this.router.navigate([ActiveUrls.ADMIN_CATEGORIES]);
  }

  navigateToAdminPayouts() {
    this.router.navigate([ActiveUrls.ADMIN_PAYOUTS]);
  }

  navigateToAdminCommissions() {
    this.router.navigate([ActiveUrls.ADMIN_COMMISSIONS]);
  }

  navigateToAdminRates() {
    this.router.navigate([ActiveUrls.ADMIN_RATES]);
  }

  navigateToAdminStatistics() {
    this.router.navigate([ActiveUrls.ADMIN_STATISTICS]);
  }

  navigateToAdminAdvertises() {
    this.router.navigate([ActiveUrls.ADMIN_ADVERTISES]);
  }

  navigateToAdminChats() {
    this.router.navigate([ActiveUrls.ADMIN_CHATS]);
  }

  navigateToDevelopment() {
    this.router.navigate([ActiveUrls.ADMIN_DEVELOPMENT]);
  }

  navigateToTasksMonitoring() {
    this.router.navigate([ActiveUrls.ADMIN_TASKS_MONITORING]);
  }

  navigateToJobs() {
    this.router.navigate([ActiveUrls.ADMIN_USERS_VACANCIES]);
  }

  navigateToAdminPromotion() {
    this.router.navigate([ActiveUrls.ADMIN_PROMOTION]);
  }

  navigateToAdminNews() {
    this.router.navigate([ActiveUrls.ADMIN_NEWS]);
  }

  navigateToCreateNewTask() {
    this.router.navigateByUrl(ActiveUrls.NEW_TASK);
  }

  navigateToFindTask() {
    this.router.navigateByUrl(ActiveUrls.FIND_TASK);
  }

  navigateToFindVacancy() {
    this.router.navigateByUrl(ActiveUrls.FIND_VACANCIES);
  }

  navigateToFindResume() {
    this.router.navigateByUrl(ActiveUrls.FIND_RESUME);
  }

  navigateToCreateVacancy() {
    this.router.navigateByUrl(ActiveUrls.NEW_VACANCY);
  }

  navigateToOpenOurPartners() {
    this.router.navigateByUrl('our_partners');
  }

  navigateToOpenOurNews() {
    this.router.navigateByUrl('our_news');
  }

  navigatePerformers() {
    this.router.navigateByUrl(ActiveUrls.PERFORMERS);
  }

  navigateToAboutUs() {
    this.router.navigateByUrl('about_us');
  }

  navigateToPromotions() {
    this.router.navigateByUrl(ActiveUrls.PROMOTION);
  }

  navigateToHome() {
    this.router.navigateByUrl('home');
  }

  authentication(headers): Observable<any> {
    return this.http.get(ApiUrls.LOGIN_ACT, { headers: headers })
      .pipe(
        tap(data => console.log('login data:', data)),
          catchError(this.handleLoginError('login error', []))
      );
  }

  authenticationProvide(provide: OAuthProvider, authToken: string): Observable<any> {
    return this.http.get(`api/auth/${provide}/${authToken}`)
      .pipe(
        tap(data => console.log('login data:', data)),
          catchError(this.handleLoginError('login error', []))
      );
  }

  verificationRequest(verificationRequest: VerificationRequest): Observable<any> {
    return this.http.post<any>(ApiUrls.VERIFICATION, verificationRequest).pipe(
      tap(data => console.log('verification request:', data)),
        catchError(this.handleVerificationError('verification error', []))
    );
  }

  sendSurveyResults(surveyResult: SurveyResult): Observable<any> {
    return this.http.post<any>(`${ApiUrls.SURVEY}`, surveyResult)
      .pipe(
        tap(data => console.log('send Survey Results:', data)),
          catchError(this.handleLoginError('send Survey Results', null))
      );
  }

  notOfferLoadApp(): Observable<any> {
    return this.http.get(ApiUrls.OFFER_LOAD_APP)
      .pipe(
        catchError(this.handleLoginError('notOfferLoadApp', null))
      );
  }

  private handleVerificationError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if(error.status == 500) {
        return of(error as T);
      }
      else if(error.status == 404) {
        this.loggedIn.next(false);
        // @ts-ignore
        return of (
          {
            errorStatus: error.status
          }
        );
      }
      return of(result as T);
    };
  }

  isPerformer(): boolean {
    const auth = this.sessionStorage.get('auth');
    if(this.isAuthNotEmpty(auth)) {
      if(AuthService.checkAuthUser(JSON.parse(auth), ROLE_MAPPER[ROLE.PERFORMER])) {
        return true;
      }
    }
    return false;
  }

  loginProvide(code: string, provide: OAuthProvider): Observable<any> {
    return this.http.post<any>(`${ApiUrls.LOGIN_PROVIDE}${provide}`, code, BaseHandlerService.httpOptions)
    .pipe(
      tap(data => console.log('login data:', data)),
      catchError(this.handleLoginError('login error', []))
    );
  }

  continueLoginProvide(failedRegistrationData: FailedRegistrationData, provide: OAuthProvider): Observable<any> {
    return this.http.post<any>(`${ApiUrls.LOGIN_PROVIDE_CONTINUE}${provide}`, failedRegistrationData, BaseHandlerService.httpOptions)
    .pipe(
      tap(data => console.log('continue login provide data:', data)),
        catchError(this.handleLoginError('continue login provide error', []))
    );
  }

  private isAuthNotEmpty = (auth: string) => {
    return auth != null && auth != "";
  };

  private handleLoginError<T>(operation = 'operation', result?: T) {
    console.log('handleLoginError')
    return (error: any): Observable<T> => {
      if(error.status === 401) {
        this.loggedIn.next(false);
        return of(result as T);
      }
      else if(error.status == 404) {
        this.loggedIn.next(false);
        // @ts-ignore
        return of (
          {
            errorStatus: error.status
          }
        );
      }
      return of(result as T);
    };
  }

}
