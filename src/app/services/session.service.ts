import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import { Observable, Subscription } from 'rxjs';
import { LoginRedirectService } from './login-redirect.service';
import * as moment from 'moment';

@Injectable()
export class SessionService {

  private readonly accessToken: string = (process.env.CRDS_ENV || '') + 'sessionId';
  private readonly refreshToken: string = (process.env.CRDS_ENV || '') + 'refreshToken';
  private cookieOptions: CookieOptionsArgs;
  private SessionLengthMilliseconds = 1800000;
  private refreshTimeout: Subscription;

  private readonly contactId: string = 'userId';

  constructor(private http: Http, private cookieService: CookieService, private router: Router,
  private loginRedirectService: LoginRedirectService) {
  this.cookieOptions = { domain: (process.env.CRDS_COOKIE_DOMAIN != null) ? process.env.CRDS_COOKIE_DOMAIN : '' };

  }

  public get(url: string, options?: RequestOptions) {
    let requestOptions = this.getRequestOption(options);
    console.log('REQUEST OPTIONS');
    console.log(requestOptions);
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
    if (res.headers != null && res.headers.get('sesssionId')) {
      this.setAccessToken(res.headers.get('sessionId'));
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
    this.cookieService.remove(this.accessToken, this.cookieOptions);
    this.cookieService.remove(this.refreshToken, this.cookieOptions);
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

  public getRequestOption(options?: RequestOptions):  RequestOptions {
    let reqOptions = options || new RequestOptions();
    reqOptions.headers = this.createAuthorizationHeader(reqOptions.headers);
    return reqOptions;
  }

  public getContactId(): number {
    return +this.cookieService.get(this.contactId);
  }

  public setContactId(contactId: string): void {
    this.cookieService.put(this.contactId, contactId, this.cookieOptions);
  }

  private createAuthorizationHeader(headers?: Headers) {
    let reqHeaders =  headers || new Headers();
    reqHeaders.set('Authorization', this.getAccessToken());
    reqHeaders.set('RefreshToken', this.getRefreshToken());
    reqHeaders.set('Content-Type', 'application/json');
    reqHeaders.set('Accept', 'application/json, text/plain, */*');
    return reqHeaders;
  }

}
