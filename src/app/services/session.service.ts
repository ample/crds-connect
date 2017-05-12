import * as moment from 'moment';
import { Address } from '../models/address';
import { CacheLevel, SmartCacheableService } from './base-service/cacheable.service';
import { CookieOptionsArgs, CookieService } from 'angular2-cookie/core';
import {
  Headers,
  Http,
  RequestOptions,
  Response
  } from '@angular/http';
import { Injectable } from '@angular/core';
import { LoginRedirectService } from './login-redirect.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { DetailedUserData } from '../models/detailed-user-data';
import { HostApplicatonForm } from '../models/host-application-form';
import { HostRequestDto } from '../models/host-request-dto';
import { Pin } from '../models/pin';
import { Router } from '@angular/router';
import { User } from '../models/user';



@Injectable()
export class SessionService extends SmartCacheableService<User, number> {

  private readonly accessToken: string = (process.env.CRDS_ENV || '') + 'sessionId';
  private readonly refreshToken: string = (process.env.CRDS_ENV || '') + 'refreshToken';
  private baseUrl = process.env.CRDS_GATEWAY_CLIENT_ENDPOINT;
  private cookieOptions: CookieOptionsArgs;
  private SessionLengthMilliseconds = 1800000;
  private refreshTimeout: Subscription;
  private readonly contactId: string = 'userId';
  public defaults = {
    authorized: null
  };

  constructor(
    private http: Http,
    private cookieService: CookieService,
    private router: Router,
    private loginRedirectService: LoginRedirectService) {
    super();
    if (process.env.CRDS_COOKIE_DOMAIN) {
      this.cookieOptions = { domain: (process.env.CRDS_COOKIE_DOMAIN != null) ? process.env.CRDS_COOKIE_DOMAIN : '' };
    }
  }

  public get(url: string, options?: RequestOptions) {
    let requestOptions = this.getRequestOption(options);
    return this.http.get(url, requestOptions).map(this.extractAuthTokenAndUnwrapBody);
  }

  public put(url: string, data: any, options?: RequestOptions) {
    let requestOptions = this.getRequestOption(options);
    return this.http.put(url, data, requestOptions).map(this.extractAuthTokenAndUnwrapBody);
  }

  public post(url: string, data: any, options?: RequestOptions) {
    let requestOptions = this.getRequestOption(options);
    return this.http.post(url, data, requestOptions).map(this.extractAuthTokenAndUnwrapBody);
  }

  private extractAuthTokenAndUnwrapBody = (res: Response) => {
    if (res.headers != null && res.headers.get('sessionid')) {
      this.setAccessToken(res.headers.get('sessionid'));
    }

    if (res.headers != null && res.headers.get('refreshToken')) {
      this.setRefreshToken(res.headers.get('refreshToken'));
    }

    let body: any;

    try {
      body = res.json();
    } catch (err) {
      body = '';
    }

    if (body != null && body.userToken) {
      this.setAccessToken(body.userToken);
    }
    if (body != null && body.refreshToken) {
      this.setRefreshToken(body.refreshToken);
    }

    this.setCookieTimeout();

    return body || {};
  }

  public setCookieTimeout() {
    let expiration = moment().add(this.SessionLengthMilliseconds, 'milliseconds').toDate();
    this.cookieOptions.expires = expiration;

    if (this.refreshTimeout) {
      this.refreshTimeout.unsubscribe();
      this.refreshTimeout = undefined;
    }

    if (this.hasToken()) {
      this.refreshTimeout = Observable.timer(expiration).subscribe(() => {
        this.clearTokens();
        this.loginRedirectService.redirectToLogin(this.router.routerState.snapshot.url);
      });
    }
  }

  public hasToken(): boolean {
    return !!this.cookieService.get(this.accessToken);
  }

  public clearTokens(): void {
    this.cookieOptions.expires = null;
    this.cookieService.remove(this.accessToken, this.cookieOptions);
    this.cookieService.remove(this.refreshToken, this.cookieOptions);
    this.cookieService.remove('username', this.cookieOptions);
    this.cookieService.remove('userId', this.cookieOptions);
  }

  public getAccessToken(): string {
    return this.cookieService.get(this.accessToken);
  }

  public getRefreshToken(): string {
    return this.cookieService.get(this.refreshToken);
  }

  public setAccessToken(value: string): void {
    this.cookieService.put(this.accessToken, value, this.cookieOptions);
  }

  public setRefreshToken(value: string): void {
    this.cookieService.put(this.refreshToken, value, this.cookieOptions);
  }

  public getRequestOption(options?: RequestOptions): RequestOptions {
    let reqOptions = options || new RequestOptions();
    reqOptions.headers = this.createAuthorizationHeader(reqOptions.headers);
    return reqOptions;
  }

  public getContactId(): number {
    let cID = +this.cookieService.get(this.contactId);
    cID = isNaN(cID) ? null : cID;
    return cID;
  }

  public addToCookie(key: string, value: string) {
    this.cookieService.put(key, value, this.cookieOptions);
  }

  private createAuthorizationHeader(headers?: Headers) {
    let reqHeaders = headers || new Headers();
    reqHeaders.set('Authorization', this.getAccessToken());
    reqHeaders.set('RefreshToken', this.getRefreshToken());
    reqHeaders.set('Content-Type', 'application/json');
    reqHeaders.set('Accept', 'application/json, text/plain, */*');
    return reqHeaders;
  }


  public getAuthentication(): Observable<any> {
    return this.get(this.baseUrl + 'api/v1.0.0/authenticated')
      .map((res: Response) => {
        return res || this.defaults.authorized;
      })
      .catch((res: Response) => {
        return [this.defaults.authorized];
      });
  }

  public isLoggedIn(): boolean {
    return this.hasToken();
  }

  // TODO: Consolidate logout and clearTokens methods. 
  public logOut(): void {
    this.clearTokens();
    return;
  }

  public clearCache(): void {
    super.clearCache();
  }

  public getUserData(): Observable<any> {
    let contactId = this.getContactId();

    if (super.cacheIsReadyAndValid(contactId, CacheLevel.Full)) {
      return Observable.of(super.getCache());
    } else {
      if (contactId !== null && contactId !== undefined && !isNaN(contactId)) {
        return this.get(`${this.baseUrl}api/v1.0.0/finder/pin/contact/${contactId}/false`)
          .map((res: Pin) => {
            return new Pin(res.firstName, res.lastName, res.emailAddress, res.contactId, res.participantId,
                           res.address, res.hostStatus, res.gathering, res.siteName, res.pinType,
                           res.proximity, res.householdId);
          })
          .catch((err: any) => {
            return Observable.throw(err.json().error);
          });
      } else {
        return Observable.of(null);
      }
    }
  }

  // TODO: Decide if this should be the profile call or not. Some benefits to still use are
  // faster, relevent connec data etc. 
  public getDetailedUserData(): Observable<any> {
    let contactId = this.getContactId();

    if (contactId !== null && contactId !== undefined && !isNaN(contactId)) {
      return this.get(`${this.baseUrl}api/v1.0.0/profile/${contactId}`)
        .map((res: any) => {
          let userAddress = new Address(res.addressId, res.addressLine1, res.addressLine2, res.city, res.state,
                                        res.postalCode, null, null, res.foreignCountry, res.county);
          let userData: DetailedUserData = new DetailedUserData(contactId, res.firstName, res.lastName, res.homePhone,
                                                                res.mobilePhone, res.emailAddress, userAddress);
          return userData;
        })
        .catch((err: any) => {
          return Observable.throw(err.json().error);
        });
    }
  }

  public getUserDetailsByContactId(contactId: number): Observable<User> {
    if (super.cacheIsReadyAndValid(contactId, CacheLevel.Partial)) {
      return Observable.of(super.getCache());
    } else {
      return this.get(`${this.baseUrl}api/v1.0.0/finder/pin/contact/${contactId}`)
        .do((details) => super.setSmartCache(details, CacheLevel.Partial, contactId))
        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
  }

  // POSTS
  public postLogin(email: string, password: string): Observable<any> {
    let body = {
      'username': email,
      'password': password
    };
    return this.post(this.baseUrl + 'api/v1.0.0/login', body)
      .map((res: any) => {
        this.addToCookie(this.contactId, res.userId);
        this.addToCookie('username', res.username);
        return res || this.defaults.authorized;
      })
      .catch(this.handleError);
  }

  public postUser(user: User): Observable<any> {
    return this.post(this.baseUrl + 'api/v1.0.0/user', user)
      .map(this.extractData)
      .catch(this.handleError);
  };

  public postHostApplication(hostApplication: HostRequestDto): Observable<any> {
    return this.post(this.baseUrl + 'api/v1.0.0/finder/pin/requesttobehost', hostApplication)
      .map(this.extractData)
      .catch(this.handleError);
  };

  public extractData(res: Response) {
    let body: any = res;
    if (typeof res.json === 'function') {
      body = res.json();
    }
    return body;
  };

  public handleError(err: Response | any) {
    return Observable.throw(err);
  };

  public isCurrentPin(pin: Pin) {
    return pin.contactId === this.getContactId();
  }

}
