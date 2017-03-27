/* tslint:disable:no-unused-variable */


import { BaseRequestOptions, Http } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BlandPageService } from './bland-page.service';
import { LoginRedirectService } from './login-redirect.service';
import { PinService } from './pin.service';
import { SessionService } from './session.service';
import { StateService } from './state.service';

import { Address } from '../models/address';
import { User } from '../models/user';
import { Pin, pinType } from '../models/pin';


class MockSessiontService {
  public getContactId(): number {
    return 222;
  }
}

describe('Service: PinService', () => {

  const mockAddress = new Address(123, 'Test St', null, 'TesVille', 'ZZ', '12345', 0, 0, 'US', 'County');
  const mockPin =
      new Pin('Bob', 'Smith', 'bobby@bob.com', 111, 2122, mockAddress, 0, null, 9999, true, '', pinType.PERSON, 0);
  const mockPinMatchingContactId =
      new Pin('Bob', 'Smith', 'bobby@bob.com', 222, 222, mockAddress, 0, null, 222, true, '', pinType.PERSON, 0);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        PinService,
        {provide: SessionService, useClass: MockSessiontService},
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

  it('should NOT list pin as the user\'s pin', inject([PinService], (service: PinService) => {
    let doesUserOwnPin = service.doesLoggedInUserOwnPin(mockPin);
    expect(doesUserOwnPin).toBe(false);
  }));

  it('should list pin as the user\'s pin', inject([PinService], (service: PinService) => {
    let doesUserOwnPin: boolean = service.doesLoggedInUserOwnPin(mockPinMatchingContactId);
    expect(doesUserOwnPin).toBe(true);
  }));

});
