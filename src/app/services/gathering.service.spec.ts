import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { Address } from '../models/address';
import { GatheringService } from './gathering.service';
import { AddMeToMapFormFields } from '../models/add-me-to-map-form-fields';
import { Pin, pinType } from '../models/pin';
import { PinSearchResultsDto } from '../models/pin-search-results-dto';
import { UserDataForPinCreation } from '../models/user-data-for-pin-creation';

describe('Service: Gathering', () => {

  const mockAddress = new Address(123, 'Test St', null, 'TesVille', 'ZZ', '12345', 0, 0, 'US', 'County');
  const mockUserData = new UserDataForPinCreation(111, 222, 9999, 'Bob', 'Smith', 'bobby@bob.com', mockAddress);
  const mockForm = new AddMeToMapFormFields('Test3 St', '', 'KarmaSt', 'II', '54321', true);
  const mockModifiedAddress = new Address(mockAddress.addressId, mockForm.addressLine1, mockForm.addressLine2,
    mockForm.city, mockForm.state, mockForm.zip, 0, 0, 'US', 'County');

  const mockPin = new Pin('Bob', 'Smith', 'bobby@bob.com', 111, 222, mockModifiedAddress, 0, null, 9999, true, '', pinType.PERSON, 0);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [ GatheringService ]
    });
  });

  it('should create a service instance', inject([GatheringService], (service: any) => {
    expect(service).toBeTruthy();
  }));

});
