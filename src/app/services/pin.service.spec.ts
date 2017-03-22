/*
 * Testing a Service
 * More info: https://angular.io/docs/ts/latest/guide/testing.html
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { PinService } from './pin.service';

import {SessionService} from './session.service';
import {StateService} from './state.service';
import {BlandPageService} from './bland-page.service';

import { User } from '../models/user';
import { Pin } from '../models/pin';

describe('PinService', () => {
  let service, mockSessionService, mockStateService, mockBlandPageService;
  
  mockSessionService = jasmine.createSpyObj<SessionService>('session', ['get', 'post']);
  mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading']);
  mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['primeAndGo']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PinService,
        { provider: SessionService, useValue: mockSessionService },
        { provider: StateService, useValue: mockStateService },
        { provider: BlandPageService, useValue: mockBlandPageService },
      ]
    });
  });

  // you can also wrap inject() with async() for asynchronous tasks
  // it('...', async(inject([...], (...) => {}));



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
