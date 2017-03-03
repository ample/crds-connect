/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SessionService } from './session.service';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, RequestOptions, Headers } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';

describe('Service: Session', () => {

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
        }]
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

      spyOn(service.cookieService, 'get').and.returnValue(mockResponse.userToken);

      const result = service.get(url);
      let expectedReqOpts = new RequestOptions();
      let expectedHeaders = new Headers();
      expectedHeaders.set('Authorization', mockResponse.userToken);
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

      spyOn(service.cookieService, 'get').and.returnValue(mockResponse.userToken);

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

});
