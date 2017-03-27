/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SessionService } from './session.service';
import { StateService } from './state.service';
import { BlandPageService } from './bland-page.service';
import { PinService } from './pin.service';
import { Observable } from 'rxjs/Rx';
import { Response, ResponseOptions } from '@angular/http';

import { Pin, pinType } from '../models/pin';
import { User } from '../models/user';
import { PinSearchResultsDto } from '../models/pin-search-results-dto';
import { MockTestData } from '../shared/MockTestData';
import { LoginRedirectService } from './login-redirect.service';
import { PinIdentifier } from '../models/pin-identifier';
import { CacheLevel } from '../services/base-service/cacheable.service';

describe('Service: Pin', () => {

  let fixture, mockSessionService, mockStateService, mockBlandPageService;
  mockSessionService = jasmine.createSpyObj<SessionService>('session', ['get', 'post']);
  mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading']);
  mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['primeAndGo']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PinService,
        { provide: SessionService, useValue: mockSessionService },
        { provide: StateService, useValue: mockStateService },
        { provide: BlandPageService, useValue: mockBlandPageService }
      ]
    })
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

  it('should get cached pin details', inject([PinService], (service: PinService) => {
    
    let pinsCache: PinSearchResultsDto, results: Pin, designatorStart: number, participantID: number, groupId: number;
    designatorStart = 98789;
    participantID = designatorStart;
    groupId = designatorStart;
    pinsCache = MockTestData.getAPinSearchResults(10, 0, 0, designatorStart, 3, pinType.GATHERING, 1);
    service['cache'] = pinsCache;
    service['cacheLevel'] = CacheLevel.Full;

    service.getPinDetails(new PinIdentifier(pinType.GATHERING, designatorStart)).subscribe(data => {
      results = data;
    });

    expect(results.participantId).toBe(participantID);
    expect(mockSessionService.get).not.toHaveBeenCalled();
    expect(service['cache'].pinSearchResults.length).toBe(10);
  }));

  it('should get pin details, no pins are cached', inject([PinService], (service: PinService) => {
    let results: Pin;
    let participantID: number;
    let pin: Pin;
    let res: Response;

    participantID = 1;

    // this is the pin our session call will get
    pin = MockTestData.getAPin(participantID);

    (<jasmine.Spy>mockSessionService.get).and.returnValue(
      Observable.of(pin)
    );


    service.getPinDetails(new PinIdentifier(pinType.GATHERING, participantID)).subscribe(data => {
      results = data;
    });
    expect(results.participantId).toBe(participantID);
    expect(mockSessionService.get).toHaveBeenCalled();
    //pins cache starts with 10 pins, but ends up with 11 because we 
    //asked for a pin that it didn't have and we had to make a trip to MP to get it.
    expect(service['cache'].pinSearchResults.length).toBe(1);

  }));
});