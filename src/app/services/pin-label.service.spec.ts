import { CookieService } from 'angular2-cookie/services/cookies.service';
import { HttpModule } from '@angular/http';
import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BlandPageService } from '../services/bland-page.service';
import { GoogleMapService } from '../services/google-map.service';
import { LoginRedirectService } from '../services/login-redirect.service';
import { PinService } from '../services/pin.service';
import { PinLabelService } from '../services/pin-label.service';
import { SessionService } from './session.service';
import { SiteAddressService } from '../services/site-address.service';
import { StateService } from '../services/state.service';

import { Address } from '../models/address';
import { Pin, pinType } from '../models/pin';
import { PinLabelData } from '../models/pin-label-data';
import { PinSearchResultsDto } from '../models/pin-search-results-dto';

import { MockTestData } from '../shared/MockTestData';

describe('Service: Pin Label', () => {

  const mockAddress = new Address(123, 'Test St', null, 'TesVille', 'ZZ', '12345', 0, 0, 'US', 'County');
  const mockPin =
    new Pin('bob', 'smith', 'bobby@bob.com', 111, 2122, mockAddress, 0, null, '', pinType.PERSON, 0, 999);

  const mockLowerCaseName: string = 'bob';
  const mockUpperCaseName: string = 'Bob';

  const mockPinLabel: any = {
    firstName: 'Bob',
    lastInitial: 'S.',
    siteName: undefined,
    isHost: false,
    isMe: false,
    pinType: pinType.PERSON
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule, RouterTestingModule.withRoutes([]),
      ],
      providers: [
        BlandPageService,
        CookieService,
        GoogleMapService,
        LoginRedirectService,
        PinLabelService,
        PinService,
        SessionService,
        SiteAddressService,
        StateService
      ]
    });
  });

  it('should create a service instance', inject([PinLabelService], (service: any) => {
    expect(service).toBeTruthy();
  }));

  it('should capitalize the first letter of a name', inject([PinLabelService], (service: any) => {
    let capitalizedName: string = service.capitalizeFirstLetter(mockLowerCaseName);
    expect(capitalizedName).toEqual(mockUpperCaseName);
  }));

  it('should create pin label data from a pin object', inject([PinLabelService], (service: any) => {

    let pinLabel: PinLabelData = service.createPinLabelData(mockPin);

    expect(pinLabel.firstName).toEqual(mockPinLabel.firstName);
    expect(pinLabel.lastInitial).toEqual(mockPinLabel.lastInitial);
    expect(pinLabel.siteName).toEqual(mockPinLabel.siteName);
    expect(pinLabel.isHost).toEqual(mockPinLabel.isHost);
    expect(pinLabel.isMe).toEqual(mockPinLabel.isMe);
    expect(pinLabel.pinType).toEqual(mockPinLabel.pinType);
  }));

  it('should return true for host', inject([PinLabelService, StateService], (service: PinLabelService, state: StateService) => {
    state.setMyViewOrWorldView('my');
    let pins = MockTestData.getAPinSearchResults(2).pinSearchResults;
    let pinsHost = MockTestData.getAPinSearchResultsGatheringHost(2).pinSearchResults;
    pins = pins.concat(pinsHost);
    let isHostTrue = service.isHostingAny(pins);

    expect(isHostTrue).toEqual(true);
  }));

  it('should return false for host', inject([PinLabelService, StateService], (service: PinLabelService, state: StateService) => {
    state.setMyViewOrWorldView('my');
    let pins = MockTestData.getAPinSearchResults(2).pinSearchResults;
    let isHostTrue = service.isHostingAny(pins);

    expect(isHostTrue).toEqual(false);
  }));

});
