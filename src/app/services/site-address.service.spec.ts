import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { Address } from '../models/address';
import { SiteAddressService } from './site-address.service';
import { AddMeToMapFormFields } from '../models/add-me-to-map-form-fields';
import { Pin, pinType } from '../models/pin';
import { PinSearchResultsDto } from '../models/pin-search-results-dto';
import { UserDataForPinCreation } from '../models/user-data-for-pin-creation';

import { MockTestData } from '../shared/MockTestData';

describe('Service: Gathering', () => {

  const oakleyStreetAddress: string = '3500 Madison Road';
  const mockAddress = new Address(123, 'Test St', null, 'TesVille', 'ZZ', '12345', 0, 0, 'US', 'County');
  const mockUserData = new UserDataForPinCreation(111, 222, 9999, 'Bob', 'Smith', 'bobby@bob.com', mockAddress);
  const mockForm = new AddMeToMapFormFields('Test3 St', '', 'KarmaSt', 'II', '54321', true);
  const mockModifiedAddress = new Address(mockAddress.addressId, mockForm.addressLine1, mockForm.addressLine2,
    mockForm.city, mockForm.state, mockForm.zip, 0, 0, 'US', 'County');

  const mockSitePin = new Pin('Bob', 'Smith', 'bobby@bob.com', 111, 222, mockModifiedAddress, 0, null, 9999, true, '', pinType.SITE, 0);
  const mockPersonPin = new Pin('Bob', 'Smith', 'bobby@bob.com', 111, 222, mockModifiedAddress, 0, null, 9999, true, '', pinType.PERSON, 0);

  const mockPinArray: Array<Pin> = [mockSitePin, mockPersonPin];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [ SiteAddressService ]
    });
  });

  it('should create a service instance', inject([SiteAddressService], (service: any) => {
    expect(service).toBeTruthy();
  }));

  it('should add address line 1 to a pin', inject([SiteAddressService], (service: any) => {
    let sitePin: Pin = mockSitePin;
    sitePin.siteName = 'Oakley';
    let changedSitePin: Pin = service.addAddressToGatheringPin(sitePin);
    expect(changedSitePin.address.addressLine1).toEqual(oakleyStreetAddress);
  }));

  it('should change the address on the site pin', inject([SiteAddressService], (service: any) => {
    let pins: Array<Pin> = mockPinArray;
    pins[0].siteName = 'Oakley';
    pins[1].siteName = 'Oakley';
    let modifiedPins: Pin = service.addAddressesToSitePins(pins);
    expect(modifiedPins[0].address.addressLine1).toEqual(oakleyStreetAddress);
  }));

  it('should NOT change the address on the person pin', inject([SiteAddressService], (service: any) => {
    let pins: Array<Pin> = mockPinArray;
    pins[0].siteName = 'Oakley';
    pins[1].siteName = 'Oakley';
    let modifiedPins: Pin = service.addAddressesToSitePins(pins);
    expect(modifiedPins[1].address.addressLine1).toEqual(mockPinArray[1].address.addressLine1);
  }));



});
