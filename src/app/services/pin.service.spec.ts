/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PinService } from './pin.service';
import { BlandPageService } from './bland-page.service';
import { SessionService } from './session.service';
import { RouterTestingModule } from '@angular/router/testing';
import { StateService } from './state.service';
import { User } from '../models/user';
import { Pin } from '../models/pin';
import { LoginRedirectService } from './login-redirect.service';

import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, RequestOptions, Headers } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';

describe('Service: PinService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        PinService,
        SessionService,
        MockBackend,
        BaseRequestOptions,
        CookieService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
        StateService,
        BlandPageService,
        LoginRedirectService
      ]
    });
  });

  it('should create an instance', inject([PinService], (service: PinService) => {
    expect(service).toBeTruthy();
  }));

  it('should create merge data dictionary', inject([PinService], (service: PinService) => {
    let expected = {
      'Community_Member_Name': 'Elmer F.',
      'Pin_First_Name': 'Buggs',
      'Community_Member_Email': 'efudd@looneytoons.com'
    };
    let testUser = new User('Elmer', 'Fudd', 'efudd@looneytoons.com', 'kwazey wabbit');
    let testPin = new Pin('Buggs', 'Bunny', 'bbunny@looneytoons.com', 1, 1, null, 1, null, 1, false, '', 1, 0);
    let actual = service.createTemplateDictionary(testUser, testPin);
    expect(actual.Community_Member_Name).toBe(expected.Community_Member_Name);
    expect(actual.Pin_First_Name).toBe(expected.Pin_First_Name);
    expect(actual.Community_Member_Email).toBe(expected.Community_Member_Email);
  }));

});
