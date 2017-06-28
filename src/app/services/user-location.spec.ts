import { async, inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { crdsOakleyCoords } from '../shared/constants';
import { GeoCoordinates } from '../models/geo-coordinates';
import { GoogleMapService } from './google-map.service';
import { IPService } from './ip.service';
import { LocationService } from './location.service';
import { PinService } from './pin.service';
import { SessionService } from './session.service';
import { StateService } from './state.service';
import { UserLocationService } from './user-location.service';

describe('UserLocationService', () => {
  let service;
  let mockIPService, mockSessionService,
    mockGoogleMapService, mockStateService, mockLocationService;

  beforeEach(() => {
    mockIPService = jasmine.createSpyObj<IPService>('ipService', ['getLocationFromIP']);
    mockSessionService = jasmine.createSpyObj<SessionService>('session', ['getContactId', 'isLoggedIn', 'getUserDetailsByContactId']);
    mockGoogleMapService = jasmine.createSpyObj<GoogleMapService>('mapHlpr', ['setDidUserAllowGeoLoc']);
    mockStateService = { navigatedFromAddToMapComponent: true };
    mockLocationService = jasmine.createSpyObj<LocationService>('location', ['getDefaultPosition', 'getCurrentPosition']);
    TestBed.configureTestingModule({
      providers: [
        UserLocationService,
        { provide: IPService, useValue: mockIPService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: GoogleMapService, useValue: mockGoogleMapService },
        { provide: StateService, useValue: mockStateService },
        { provide: LocationService, useValue: mockLocationService }
        // for additional providers, write as examples below
        // ServiceName,
        // { provider: ServiceName, useValue: fakeServiceName },
        // { provider: ServiceName, useClass: FakeServiceClass },
        // { provider: ServiceName, useFactory: fakeServiceFactory, deps: [] },
      ]
    });
  });

  it('should create an instance', inject([UserLocationService], (userLocationService: UserLocationService) => {
    expect(userLocationService).toBeTruthy();
  }));

  it('Should get the default Crds-Oakley coordinates', inject([UserLocationService], (userLocationService: UserLocationService) => {
    let coords = new GeoCoordinates(32, 42);
    (mockLocationService.getDefaultPosition).and.returnValue(coords)
    let result = userLocationService['getUserLocationFromDefault']();
    expect(mockLocationService.getDefaultPosition).toHaveBeenCalledTimes(1);
    expect(result).toEqual(coords);
  }));

  it('Should get a location as a GeoCoordinates object', async(inject(
    [UserLocationService],
    (userLocationService: UserLocationService) => {
      let coords = new GeoCoordinates(42, 42);
      (mockIPService.getLocationFromIP).and.returnValue(Observable.of({latitude: coords.lat, longitude: coords.lng}));

      let obs = userLocationService['getUserLocationFromIp']();

      obs.subscribe(
        data => {
          expect(data).toEqual(coords);
        }
      );
    })));

});
