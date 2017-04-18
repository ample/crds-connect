/* tslint:disable:no-unused-variable */


import { BaseRequestOptions, Http } from '@angular/http';
import { TestBed, async, inject } from '@angular/core/testing';

import { SiteAddressService } from '../services/site-address.service';
import { SessionService } from './session.service';
import { StateService } from './state.service';
import { GoogleMapService } from './google-map.service';
import { BlandPageService } from './bland-page.service';
import { PinService } from './pin.service';
import { Observable } from 'rxjs/Rx';
import { Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { Pin, pinType } from '../models/pin';
import { User } from '../models/user';
import { PinSearchResultsDto } from '../models/pin-search-results-dto';
import { MockTestData } from '../shared/MockTestData';
import { PinIdentifier } from '../models/pin-identifier';
import { CacheLevel } from '../services/base-service/cacheable.service';
import { Address } from '../models/address';

describe('Service: Pin', () => {
  let fixture, mockSessionService, mockStateService, mockBlandPageService, mockGoogleMapService;
  mockSessionService = jasmine.createSpyObj<SessionService>('session', ['get', 'post', 'getContactId']);
  mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading']);
  mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['primeAndGo']);
  mockGoogleMapService = jasmine.createSpyObj<GoogleMapService>('googlemapservice', ['get', 'post', 'getContactId']);

  const mockAddress = new Address(123, 'Test St', null, 'TesVille', 'ZZ', '12345', 0, 0, 'US', 'County');
  const mockAddress2 = new Address(123, 'Billy St', null, 'BillyVille', 'ZZ', '54321', 0, 0, 'US', 'County');

  const mockPin =
    new Pin('Bob', 'Smith', 'bobby@bob.com', 111, 2122, mockAddress, 0, null, 9999, true, '', pinType.PERSON, 0);
  const updatedMockPin =
      new Pin('Bob', 'Smith', 'bobby@bob.com', 111, 2122, mockAddress2, 0, null, 9999, true, '', pinType.PERSON, 0);
  const mockPin2 =
      new Pin('Billy', 'Bob', 'billy@bob.com', 111, 2122, null, 0, null, 9999, true, '', pinType.PERSON, 0);

  const mockPins: Pin[] = [mockPin, mockPin2];

  const mockPinMatchingContactId =
    new Pin('Bob', 'Smith', 'bobby@bob.com', 222, 222, mockAddress, 0, null, 222, true, '', pinType.PERSON, 0);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SiteAddressService,
        PinService,
        { provide: SessionService, useValue: mockSessionService },
        { provide: StateService, useValue: mockStateService },
        { provide: BlandPageService, useValue: mockBlandPageService },
        { provide: GoogleMapService, useValue: mockGoogleMapService },
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
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
      'Community_Member_Email': 'efudd@looneytoons.com',
      'Community_Member_City': 'TesVille',
      'Community_Member_State': 'ZZ'
    };
    let testUser = new User('Elmer', 'Fudd', 'efudd@looneytoons.com', 'kwazey wabbit', mockAddress);
    let testPin = new Pin('Buggs', 'Bunny', 'bbunny@looneytoons.com', 1, 1, null, 1, null, 1, false, '', 1, 0);
    let actual = service.createSayHiTemplateDictionary(testUser, testPin);
    expect(actual.Community_Member_Name).toBe(expected.Community_Member_Name);
    expect(actual.Pin_First_Name).toBe(expected.Pin_First_Name);
    expect(actual.Community_Member_Email).toBe(expected.Community_Member_Email);
    expect(actual.Community_Member_City).toBe(expected.Community_Member_City);
    expect(actual.Community_Member_State).toBe(expected.Community_Member_State);
  }));

  it('should get cached pin details', inject([PinService], (service: PinService) => {
    <jasmine.Spy>(mockSessionService.getContactId).and.returnValue(123);
    let pinsCache: PinSearchResultsDto, results: Pin, designatorStart: number, participantID: number, groupId: number;
    designatorStart = 98789;
    participantID = designatorStart;
    groupId = designatorStart;
    pinsCache = MockTestData.getAPinSearchResults(10, 0, 0, designatorStart, 3, pinType.GATHERING, 1);
    service['cache'] = pinsCache;
    service['cacheLevel'] = CacheLevel.Full;
    service['userIdentifier'] = 123;

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
    // pins cache starts with 10 pins, but ends up with 11 because we 
    // asked for a pin that it didn't have and we had to make a trip to MP to get it.
    expect(service['cache'].pinSearchResults.length).toBe(1);

  }));

  it('should NOT list pin as the user\'s pin', inject([PinService], (service: PinService) => {
    <jasmine.Spy>(mockSessionService.getContactId).and.returnValue(222);
    let doesUserOwnPin = service.doesLoggedInUserOwnPin(mockPin);
    expect(doesUserOwnPin).toBe(false);
  }));

  it('should list pin as the user\'s pin', inject([PinService], (service: PinService) => {
    <jasmine.Spy>(mockSessionService.getContactId).and.returnValue(222);
    let doesUserOwnPin: boolean = service.doesLoggedInUserOwnPin(mockPinMatchingContactId);
    expect(doesUserOwnPin).toBe(true);
  }));

  it('should post a pin and clear cache', inject([PinService], (service: PinService) => {
    let pinsCache: PinSearchResultsDto, results: Pin, designatorStart: number, participantID: number, groupId: number;
    designatorStart = 98789;
    participantID = designatorStart;
    groupId = designatorStart;
    pinsCache = MockTestData.getAPinSearchResults(10, 0, 0, designatorStart, 3, pinType.GATHERING, 1);
    service['cache'] = pinsCache;
    service['cacheLevel'] = CacheLevel.Full;
    service['userIdentifier'] = 123;
    let pin = MockTestData.getAPin();
    <jasmine.Spy>(mockSessionService.post).and.returnValue(Observable.of(pin));
    service.postPin(pin).subscribe( (result) => {;
      expect(service['cache']).toBeNull();
      expect(result.contactId).toBe(pin.contactId);
      });
    }));

    it('doesLoggedInUserOwnPin() should return true if contactId matches',
          inject([PinService], (service: PinService) => {
      mockSessionService.getContactId.and.returnValue(2562378);
      let pin = MockTestData.getAPin();
      pin.contactId = 2562378;
      let returnValue = service.doesLoggedInUserOwnPin(pin);
      expect(returnValue).toBe(true);
    }));

    it('doesLoggedInUserOwnPin() should return false if contactId doesn\'t match',
          inject([PinService], (service: PinService) => {
      mockSessionService.getContactId.and.returnValue(42);
      let pin = MockTestData.getAPin();
      let returnValue = service.doesLoggedInUserOwnPin(pin);
      expect(returnValue).toBe(false);
    }));

    it('should update the pin with the updated address', inject([PinService], (service: PinService) => {
      let pins: Pin[] = mockPins;
      let updatedPin = updatedMockPin;
      let updatedPinOldAddress = mockAddress;

      pins = service.replaceAddressOnUpdatedPin(pins, updatedPin, updatedPinOldAddress);

      expect(pins[0].address).toEqual(mockAddress2);
    }));



});
