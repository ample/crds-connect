/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SessionService } from './session.service';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, RequestOptions, Headers } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { Router } from '@angular/router';
import { LoginRedirectService } from './login-redirect.service';
import { Observable, Subscription } from 'rxjs';
import * as moment from 'moment';

describe('Service: Session', () => {
  let mockLoginRedirectService;
  const mockResponse = {
    'userToken': 'AAEAAKVu0E-usertoken',
    'userTokenExp': '1800',
    'refreshToken': 'RF8l!IAAAACmMA6Di0_refreshtoken',
    'userId': 1234567,
    'username': 'testuser',
    'userEmail': 'user@test.com',
    'roles': [
      {
        'Id': 2,
        'Name': 'Administrators'
      },
      {
        'Id': 39,
        'Name': 'All Platform Users'
      },
      {
        'Id': 95,
        'Name': 'All Backend Users - CRDS'
      },
      {
        'Id': 1005,
        'Name': 'Batch Manager Administrators'
      }
    ],
    'age': 50,
    'userPhone': '123-456-7890'
  };

  beforeEach(() => {
    mockLoginRedirectService = jasmine.createSpyObj<LoginRedirectService>('loginRedirectService', ['redirectToLogin']);
    TestBed.configureTestingModule({
      providers: [
        SessionService,
        MockBackend,
        BaseRequestOptions,
        CookieService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: Router, useValue: { routerState: { snapshot: { url: 'www.crossroads.net' } } } },
        { provide: LoginRedirectService, useValue: mockLoginRedirectService }
        ]
    });
  });

  it('should create an instance', inject([SessionService], (service: SessionService) => {
    expect(service).toBeTruthy();
  }));

  it('should attach auth token to get request', inject(
    [SessionService, MockBackend],
    (service, mockBackend) => {
      let url = 'api/url';

      spyOn(service.http, 'get').and.callThrough();
      mockBackend.connections.subscribe(conn => {
        conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
      });

      spyOn(service.cookieService, 'get').and.returnValues(mockResponse.userToken, mockResponse.refreshToken);

      const result = service.get(url);
      let expectedReqOpts = new RequestOptions();
      let expectedHeaders = new Headers();
      expectedHeaders.set('Authorization', mockResponse.userToken);
      expectedHeaders.set('RefreshToken', mockResponse.refreshToken);
      expectedHeaders.set('Content-Type', 'application/json');
      expectedHeaders.set('Accept', 'application/json, text/plain, */*');
      expectedReqOpts.headers = expectedHeaders;
      expect(service.http.get).toHaveBeenCalledWith(url, expectedReqOpts);
  }));

  it('should refresh auth tokens from response', async(inject(
    [SessionService, MockBackend],
    (service, mockBackend) => {
      let url = 'api/url';

      mockBackend.connections.subscribe(conn => {
        conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
      });

      spyOn(Observable, 'timer').and.returnValue(Observable.of({}));
      spyOn(service.cookieService, 'remove').and.returnValue(true);

      const result = service.get(url);
      result.subscribe(res => {
        expect(service.getAccessToken()).toBe(mockResponse.userToken);
      });

  })));


  it('should set access token', inject([SessionService], (service: any) => {
    let accessToken = 'qwertyuio1234567890';
    spyOn(service.cookieService, 'put');
    service.setAccessToken(accessToken);
    expect(service.cookieService.put).toHaveBeenCalledWith(service.accessToken, accessToken, service.cookieOptions);
  }));

  it('should set refresh token', inject([SessionService], (service: any) => {
    let refreshToken = 'zxcvbnm97654123';
    spyOn(service.cookieService, 'put');
    service.setRefreshToken(refreshToken);
    expect(service.cookieService.put).toHaveBeenCalledWith(service.refreshToken, refreshToken, service.cookieOptions);
  }));

  it('should get access token', inject([SessionService], (service: any) => {
    let accessToken = 'qwertyuio1234567890';
    spyOn(service.cookieService, 'get');
    service.getAccessToken(accessToken);
    expect(service.cookieService.get).toHaveBeenCalledWith(service.accessToken);
  }));

  it('should get refresh token', inject([SessionService], (service: any) => {
    let refreshToken = 'zxcvbnm97654123';
    spyOn(service.cookieService, 'get');
    service.getRefreshToken(refreshToken);
    expect(service.cookieService.get).toHaveBeenCalledWith(service.refreshToken);
  }));

  it('should check if user is logged in', inject([SessionService], (service: any) => {
    let accessToken = 'qwertyuio1234567890';
    spyOn(service.cookieService, 'get').and.returnValue(accessToken);
    expect(service.hasToken()).toBeTruthy();
  }));

  it('should check if user is not logged in', inject([SessionService], (service: any) => {
    spyOn(service.cookieService, 'get').and.returnValue(undefined);
    expect(service.hasToken()).toBeFalsy();
  }));

  it('should log a user out', inject([SessionService], (service: any) => {
    let accessToken = 'qwertyuio1234567890';
    service.setAccessToken(accessToken);
    service.clearTokens();
    expect(service.hasToken()).toBeFalsy();
  }));

  it('should set contactId', inject([SessionService], (service: any) => {
    spyOn(service.cookieService, 'put');
    service.setContactId('12345');
    expect(service.cookieService.put).toHaveBeenCalledWith(service.contactId, '12345', service.cookieOptions);
  }));

  it ('should get contactId', inject([SessionService], (service: any) => {
    spyOn(service.cookieService, 'get').and.returnValue('12345');
    let contactId = service.getContactId();
    expect(service.cookieService.get).toHaveBeenCalledWith(service.contactId);
    expect(contactId).toBe(12345);
  }));

  describe('Service: Session cookie timeouts', () => {

    it('should work', inject([SessionService], (service: SessionService) => {
      service.setCookieTimeout();
    }));

    it('should setup timer if logged in',  inject([SessionService], (service: any) => {
      service.setAccessToken('token');
      service.setRefreshToken('refreshToken');
      spyOn(Observable, 'timer').and.returnValue(Observable.of({}));
      spyOn(service.cookieService, 'remove').and.callThrough();

      expect(service['refreshTimeout']).toBeUndefined();
      service.setCookieTimeout();
      expect(service['refreshTimeout']).toBeDefined();
      expect(service.cookieService.remove.calls.count()).toBe(2);
      expect(mockLoginRedirectService.redirectToLogin).toHaveBeenCalledWith('www.crossroads.net');
    }));

    it('should unsubscribe old Observable when creating a new timer',  inject([SessionService], (service: any) => {
      service.setAccessToken('token');
      service.setRefreshToken('refreshToken');
      let subscription = jasmine.createSpyObj<Subscription>('subscription', ['unsubscribe']);
      service['refreshTimeout'] = subscription;
      spyOn(Observable, 'timer').and.returnValue(Observable.of({}));
      spyOn(service.cookieService, 'remove').and.callThrough();

      service.setCookieTimeout();
      expect(service['refreshTimeout']).toBeDefined();
      expect(service.cookieService.remove.calls.count()).toBe(2);
      expect(mockLoginRedirectService.redirectToLogin).toHaveBeenCalledWith('www.crossroads.net');
      expect(subscription.unsubscribe).toHaveBeenCalled();
    }));
  });


});
