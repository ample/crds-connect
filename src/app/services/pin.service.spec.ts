import { BaseRequestOptions, Http } from '@angular/http';
import { TestBed, async, inject } from '@angular/core/testing';

import { AddressService } from '../services/address.service';
import { AppSettingsService } from '../services/app-settings.service';
import { SiteAddressService } from '../services/site-address.service';
import { SessionService } from './session.service';
import { StateService } from './state.service';
import { GoogleMapService } from './google-map.service';
import { BlandPageService } from './bland-page.service';
import { PinService } from './pin.service';
import { Observable } from 'rxjs/Rx';
import { MockBackend } from '@angular/http/testing';
import { Response, ResponseOptions } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { Pin, pinType, GeoCoordinates, User, PinSearchResultsDto, PinIdentifier, Address } from '../models';
import { PinSearchRequestParams } from '../models/pin-search-request-params';
import { Person } from '../models/person';
import { MockTestData } from '../shared/MockTestData';
import { CacheLevel } from '../services/base-service/cacheable.service';

describe('Service: Pin', () => {
  let fixture, mockAddressService, mockAppSettings, mockSessionService, mockStateService, mockBlandPageService, mockGoogleMapService, mockRouter;

  mockAddressService = jasmine.createSpyObj<AddressService>('addressService', ['clearCache']);
  mockAppSettings = jasmine.createSpyObj<AppSettingsService>('appSettings', ['isConnectApp', 'isSmallGroupApp']);
  mockSessionService = jasmine.createSpyObj<SessionService>('session', ['get', 'post', 'getContactId']);
  mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading', 'getMapView']);
  mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['primeAndGo']);
  mockGoogleMapService = jasmine.createSpyObj<GoogleMapService>('googlemapservice', ['get', 'post', 'getContactId']);
  mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);

  const mockAddress = new Address(123, 'Test St', null, 'TesVille', 'ZZ', '12345', 0, 0, 'US', 'County');
  const mockAddress2 = new Address(123, 'Billy St', null, 'BillyVille', 'ZZ', '54321', 0, 0, 'US', 'County');

  const mockPin =
    new Pin('Bob', 'Smith', 'bobby@bob.com', 111, 2122, mockAddress, 0, null, '', pinType.PERSON, 0, 999);
  const updatedMockPin =
    new Pin('Bob', 'Smith', 'bobby@bob.com', 111, 2122, mockAddress2, 0, null, '', pinType.PERSON, 0, 999);
  const mockPin2 =
    new Pin('Billy', 'Bob', 'billy@bob.com', 111, 2122, null, 0, null, '', pinType.PERSON, 0, 999);

  const mockPins: Pin[] = [mockPin, mockPin2];

  const mockPinMatchingContactId =
    new Pin('Bob', 'Smith', 'bobby@bob.com', 222, 222, mockAddress, 0, null, '', pinType.PERSON, 0, 999);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SiteAddressService,
        PinService,
        { provide: AddressService, useValue: mockAddressService },
        { provide: AppSettingsService, useValue: mockAppSettings },
        { provide: SessionService, useValue: mockSessionService },
        { provide: StateService, useValue: mockStateService },
        { provide: BlandPageService, useValue: mockBlandPageService },
        { provide: GoogleMapService, useValue: mockGoogleMapService },
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: Router, useValue: mockRouter }
      ], imports: [
        RouterTestingModule.withRoutes([])
      ]
    });
  });

  it('should create an instance', inject([PinService], (service: PinService) => {
    expect(service).toBeTruthy();
  }));

  it('should create merge data dictionary', inject([PinService], (service: PinService) => {
    const message = 'Star Wars';
    const expected = {
      'Community_Member_Name': 'Elmer F.',
      'Pin_First_Name': 'Buggs',
      'Community_Member_Email': 'efudd@looneytoons.com',
      'Community_Member_City': 'TesVille',
      'Community_Member_State': 'ZZ',
      'User_Message' : message
    };
    const testUser = new Pin('Elmer', 'Fudd', 'efudd@looneytoons.com', 1, 1, mockAddress, 0, null, '', 1, 0, 999);
    const testPin = new Pin('Buggs', 'Bunny', 'bbunny@looneytoons.com', 1, 1, null, 1, null, '', 1, 0, 999);
    const actual = service.createSayHiTemplateDictionary(testUser, testPin, message);
    expect(actual.Community_Member_Name).toBe(expected.Community_Member_Name);
    expect(actual.Pin_First_Name).toBe(expected.Pin_First_Name);
    expect(actual.Community_Member_Email).toBe(expected.Community_Member_Email);
    expect(actual.Community_Member_City).toBe(expected.Community_Member_City);
    expect(actual.Community_Member_State).toBe(expected.Community_Member_State);
    expect(actual.User_Message).toBe(message);
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
    const doesUserOwnPin = service.doesLoggedInUserOwnPin(mockPin);
    expect(doesUserOwnPin).toBe(false);
  }));

  it('should list pin as the user\'s pin', inject([PinService], (service: PinService) => {
    <jasmine.Spy>(mockSessionService.getContactId).and.returnValue(222);
    const doesUserOwnPin: boolean = service.doesLoggedInUserOwnPin(mockPinMatchingContactId);
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
    const pin = MockTestData.getAPin();
    <jasmine.Spy>(mockSessionService.post).and.returnValue(Observable.of(pin));
    service.postPin(pin).subscribe((result) => {
      ;
      expect(service['cache']).toBeNull();
      expect(result.contactId).toBe(pin.contactId);
    });
  }));

  it('doesLoggedInUserOwnPin() should return true if contactId matches',
    inject([PinService], (service: PinService) => {
      <jasmine.Spy>(mockSessionService.post).and.returnValue(Observable.of(true));
      mockSessionService.getContactId.and.returnValue(2562378);
      const pin = MockTestData.getAPin();
      pin.contactId = 2562378;
      const returnValue = service.doesLoggedInUserOwnPin(pin);
      expect(returnValue).toBe(true);
    }));

  it('doesLoggedInUserOwnPin() should return false if contactId doesn\'t match',
    inject([PinService], (service: PinService) => {
      <jasmine.Spy>(mockSessionService.post).and.returnValue(Observable.of(true));
      mockSessionService.getContactId.and.returnValue(42);
      const pin = MockTestData.getAPin();
      const returnValue = service.doesLoggedInUserOwnPin(pin);
      expect(returnValue).toBe(false);
    }));

  it('should update the pin with the updated address', inject([PinService], (service: PinService) => {
    let pins: Pin[] = mockPins;
    const updatedPin = updatedMockPin;
    const updatedPinOldAddress = mockAddress;

    pins = service.replaceAddressOnUpdatedPin(pins, updatedPin, updatedPinOldAddress);

    expect(pins[0].address).toEqual(mockAddress2);
  }));

  it('should re-sort by center coords', inject([PinService], (service: PinService) => {
    let pins: Pin[] = new Array();
    pins.push(MockTestData.getAPin(3));
    pins.push(MockTestData.getAPin(1));
    pins.push(MockTestData.getAPin(2));
    const centerCoords = new GeoCoordinates(0, 0);

    const reSortedPins = service.reSortBasedOnCenterCoords(pins, centerCoords);
    expect(reSortedPins[0].contactId).toBe(1);
    expect(reSortedPins[1].contactId).toBe(2);
    expect(reSortedPins[2].contactId).toBe(3);
  }));

  it('should redirect to groups in group mode', inject([PinService], (service: PinService) => {
    const pin = MockTestData.getAPin(1, 3, pinType.SMALL_GROUP, 5, 5);
    (mockAppSettings.isConnectApp).and.returnValue(false);
    service.navigateToPinDetailsPage(pin);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['small-group/1/']);
  }));

  it('should redirect to groups in group mode', inject([PinService], (service: PinService) => {
    const pin = MockTestData.getAPin(1, 3, pinType.GATHERING, 5, 5);
    (mockAppSettings.isConnectApp).and.returnValue(true);
    service.navigateToPinDetailsPage(pin);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['gathering/1/']);
  }));

  it('should create valid search params', inject([PinService], (service: PinService) => {
    const expectedSearchParams = new PinSearchRequestParams('ayy', null, null);
    const actualSearchParams: PinSearchRequestParams = service.buildPinSearchRequest('ayy', null);
    expect(actualSearchParams).toEqual(expectedSearchParams);

  }));

  it('should remove pin from results if the pin is deleted', inject([PinService], (service: PinService) => {
    const mockIdOfPinToDelete = 9876543210;
    const mockTypeOfPinToDelete: number = pinType.PERSON;
    const mockDeletedPinIdentifier: PinIdentifier = new PinIdentifier(mockTypeOfPinToDelete, mockIdOfPinToDelete);
    const mockPinOne: Pin = MockTestData.getAPin();
    const mockPinTwo: Pin = MockTestData.getAPin(mockIdOfPinToDelete, 1, mockTypeOfPinToDelete, 5, 5);
    const mockPins2: Pin[] = [mockPinOne, mockPinTwo];
    const filteredMockPins = service.removePinFromResultsIfDeleted(mockPins2, mockDeletedPinIdentifier);

    const expectedFilteredLength = 1;
    const expectedRemaininingPin = filteredMockPins[0];

    expect(filteredMockPins.length).toEqual(expectedFilteredLength);
    expect(expectedRemaininingPin.contactId).toEqual(1);

  }));

  it('addToGroup should call with proper params', inject([PinService], (service: PinService) => {
    <jasmine.Spy>(mockSessionService.post).and.returnValue(Observable.of(true));
    const person = new Person('Bob', 'Smith', 'bob@bob.com');
    service.addToGroup(123, person, 27);
    expect(mockSessionService.post).toHaveBeenCalledWith('http://localhost:49380/api/v1.0.0/finder/pin/addtogroup/123/27', person);
  }));
}
);
