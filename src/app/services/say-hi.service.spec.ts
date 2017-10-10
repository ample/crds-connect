/*
 * Testing a Service
 * More info: https://angular.io/docs/ts/latest/guide/testing.html
 */

import { TestBed, async, inject } from '@angular/core/testing';

import { SayHiService } from './say-hi.service';
import { StateService } from './state.service';
import { SessionService } from './session.service';
import { BlandPageService } from './bland-page.service';

import { Pin, Address } from '../models';

describe('SayHiService', () => {
  let service;
  let mockStateService, mockSessionService, mockBlandPageService;

  mockStateService = jasmine.createSpyObj<StateService>('state', ['']);
  mockSessionService = jasmine.createSpyObj<SessionService>('session', ['']);
  mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SayHiService,
        { provide: StateService, useValue: mockStateService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: BlandPageService, useValue: mockBlandPageService }
      ]
    });
  });

  it(
    'should create merge data dictionary',
    inject([SayHiService], (service: SayHiService) => {
      let mockAddress = new Address(123, 'Test St', null, 'TesVille', 'ZZ', '12345', 0, 0, 'US', 'County');
      const expected = {
        Community_Member_Name: 'Elmer F.',
        Pin_First_Name: 'Buggs',
        Community_Member_Email: 'efudd@looneytoons.com',
        Community_Member_City: 'TesVille',
        Community_Member_State: 'ZZ'
      };
      const testUser = new Pin('Elmer', 'Fudd', 'efudd@looneytoons.com', 1, 1, mockAddress, 0, null, '', 1, 0, 999);
      const testPin = new Pin('Buggs', 'Bunny', 'bbunny@looneytoons.com', 1, 1, null, 1, null, '', 1, 0, 999);
      const actual = service.createSayHiTemplateDictionary(testUser, testPin);
      expect(actual.Community_Member_Name).toBe(expected.Community_Member_Name);
      expect(actual.Pin_First_Name).toBe(expected.Pin_First_Name);
      expect(actual.Community_Member_Email).toBe(expected.Community_Member_Email);
      expect(actual.Community_Member_City).toBe(expected.Community_Member_City);
      expect(actual.Community_Member_State).toBe(expected.Community_Member_State);
    })
  );
});
