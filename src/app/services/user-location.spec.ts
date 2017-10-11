import { MockTestData } from '../shared/MockTestData';
import { async, inject, TestBed } from '@angular/core/testing';
import { crdsOakleyCoords } from '../shared/constants';
import { GeoCoordinates } from '../models/geo-coordinates';
import { GeoLocationService } from './geo-location.service';
import { IPService } from './ip.service';
import { Observable } from 'rxjs/Rx';
import { SessionService } from './session.service';
import { UserLocationService } from './user-location.service';
import { User } from '../models';

describe('UserLocationService', () => {
  let service;
  let mockIPService, mockSessionService, mockLocationService;

  beforeEach(() => {
    mockIPService = jasmine.createSpyObj<IPService>('ipService', ['getLocationFromIP']);
    mockSessionService = jasmine.createSpyObj<SessionService>('session', ['getContactId', 'isLoggedIn', 'getUserDetailsByContactId']);
    mockLocationService = jasmine.createSpyObj<GeoLocationService>('location', ['getDefaultPosition', 'getCurrentPosition']);
    TestBed.configureTestingModule({
      providers: [
        UserLocationService,
        { provide: IPService, useValue: mockIPService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: GeoLocationService, useValue: mockLocationService }
      ]
    });
  });

  it('should create an instance', inject([UserLocationService], (userLocationService: UserLocationService) => {
    expect(userLocationService).toBeTruthy();
  }));

  it('Should get the default coordinates from geolocation', inject([UserLocationService], (userLocationService: UserLocationService) => {
    const coords = new GeoCoordinates(32, 42);
    mockLocationService.getDefaultPosition.and.returnValue(coords);
    const result = userLocationService['getUserLocationFromDefault']();
    expect(mockLocationService.getDefaultPosition).toHaveBeenCalledTimes(1);
    expect(result).toEqual(coords);
  }));

  it('Should get a location from Ip address', inject(
    [UserLocationService],
    (userLocationService: UserLocationService) => {
      const coords = new GeoCoordinates(42, 42);
      mockIPService.getLocationFromIP.and.returnValue(Observable.of({ latitude: coords.lat, longitude: coords.lng }));

      const obs = userLocationService['getUserLocationFromIpAddress'](1);

      obs.subscribe(
        data => {
          expect(data).toEqual(coords);
          expect(mockIPService.getLocationFromIP).toHaveBeenCalledTimes(1);
        }
      );
    }));

  it('Should getLocationFromGeolocation', inject([UserLocationService], (userLocationService: UserLocationService) => {
    const coords = new GeoCoordinates(42, 42);
    mockLocationService.getCurrentPosition.and.returnValue(Observable.of(coords));
    const contactId = 1;
    const obs = userLocationService['getLocationFromGeolocation'](contactId);

    obs.subscribe(data => {
      expect(data).toEqual(coords);
      expect(mockLocationService.getCurrentPosition).toHaveBeenCalledTimes(1);
    });
  }));

  it('Should getLocationByContactID', inject([UserLocationService], (userLocationService: UserLocationService) => {
    const coords = new GeoCoordinates(42, 42);
    const userData = MockTestData.getADetailedUserData();
    userData.address.latitude = coords.lat;
    userData.address.longitude = coords.lng;
    mockSessionService.getUserDetailsByContactId.and.returnValue(Observable.of(userData));
    const contactId = 1;
    const obs = userLocationService['getLocationByContactId'](contactId);

    obs.subscribe(data => {
      expect(data).toEqual(coords);
      expect(mockSessionService.getUserDetailsByContactId).toHaveBeenCalledTimes(1);
    });
  }));

  describe('getLocation should work correctly', () => {
    it('Should getLocation.first should return GeoLocation', inject([UserLocationService], (userLocationService: UserLocationService) => {
      const geoLocationCoords = new GeoCoordinates(42, 42);
      const contactIdLocationCoords = new GeoCoordinates(11, 11);
      const locationFromIpAddress = new GeoCoordinates(1337, 1337);
      const userData = MockTestData.getADetailedUserData();
      const contactId = 1;
      userData.address.latitude = contactIdLocationCoords.lat;
      userData.address.longitude = contactIdLocationCoords.lng;
      mockLocationService.getCurrentPosition.and.returnValue(Observable.of(geoLocationCoords));
      mockSessionService.getUserDetailsByContactId.and.returnValue(Observable.of(userData));
      mockIPService.getLocationFromIP.and.returnValue(Observable.of(locationFromIpAddress));
      mockSessionService.getContactId.and.returnValue(contactId);

      const obs = userLocationService.GetUserLocation();

      obs.first().subscribe(data => {
        expect(data).toEqual(geoLocationCoords);
      });
    }));

    it('Should getLocation.first should return contactIdLocation', inject([UserLocationService], (userLocationService: UserLocationService) => {
      const geoLocationCoords = new GeoCoordinates(42, 42);
      const contactIdLocationCoords = new GeoCoordinates(11, 11);
      const locationFromIpAddress = new GeoCoordinates(1337, 1337);
      const userData = MockTestData.getADetailedUserData();
      const contactId = 1;
      userData.address.latitude = contactIdLocationCoords.lat;
      userData.address.longitude = contactIdLocationCoords.lng;
      mockLocationService.getCurrentPosition.and.returnValue(Observable.throw({}));
      mockSessionService.getUserDetailsByContactId.and.returnValue(Observable.of(userData));
      mockIPService.getLocationFromIP.and.returnValue(Observable.of(locationFromIpAddress));
      mockSessionService.getContactId.and.returnValue(contactId);

      const obs = userLocationService.GetUserLocation();

      obs.first().subscribe(data => {
        expect(data).toEqual(contactIdLocationCoords);
      });
    }));

    it('Should getLocation.first should return IPAddressLoc', inject([UserLocationService], (userLocationService: UserLocationService) => {
      const locationFromIpAddress = new GeoCoordinates(1337, 1337);
      const contactId = 1;
      mockLocationService.getCurrentPosition.and.returnValue(Observable.throw({}));
      mockSessionService.getUserDetailsByContactId.and.returnValue(Observable.throw({}));
      mockIPService.getLocationFromIP.and.returnValue(Observable.of({ latitude: locationFromIpAddress.lat, longitude: locationFromIpAddress.lng }));
      mockSessionService.getContactId.and.returnValue(contactId);

      const obs = userLocationService.GetUserLocation();

      obs.first().subscribe(data => {
        expect(data).toEqual(locationFromIpAddress);
      });
    }));

    it('Should getLocation.first should return default loc', inject([UserLocationService], (userLocationService: UserLocationService) => {
      const coords = new GeoCoordinates(1337, 1337);
      const contactId = 1;
      mockLocationService.getCurrentPosition.and.returnValue(Observable.throw({}));
      mockSessionService.getUserDetailsByContactId.and.returnValue(Observable.throw({}));
      mockIPService.getLocationFromIP.and.returnValue(Observable.throw({}));
      mockSessionService.getContactId.and.returnValue(contactId);
      mockLocationService.getDefaultPosition.and.returnValue(coords);

      const obs = userLocationService.GetUserLocation();

      obs.first().subscribe(data => {
        expect(data).toEqual(coords);
      });
    }));

  });
});
