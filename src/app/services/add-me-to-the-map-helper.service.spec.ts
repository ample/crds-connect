import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { Address } from '../models/address';
import { AddMeToTheMapHelperService } from './add-me-to-map-helper.service';
import { AddMeToMapFormFields } from '../models/add-me-to-map-form-fields';
import { Pin, pinType } from '../models/pin';
import { UserDataForPinCreation } from '../models/user-data-for-pin-creation';

describe('Service: Add me to the Map Helper', () => {

  const mockAddress = new Address(123, 'Test St', null, 'TesVille', 'ZZ', '12345', 0, 0);
  const mockUserData = new UserDataForPinCreation(111, 222, 9999, 'Bob', 'Smith', 'bobby@bob.com', mockAddress);
  const mockForm = new AddMeToMapFormFields('Test3 St', '', 'KarmaSt', 'II', '54321', true);
  const mockModifiedAddress = new Address(mockAddress.addressId, mockForm.addressLine1, mockForm.addressLine2,
    mockForm.city, mockForm.state, mockForm.zip, 0, 0);

  const mockPin = new Pin('Bob', 'Smith', 'bobby@bob.com', 111, 222, mockModifiedAddress, 0, null, 9999, true, '', pinType.PERSON, 0);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [AddMeToTheMapHelperService]
    });
  });

  it('should create a pin', inject([AddMeToTheMapHelperService], (service: any) => {
    let pin: Pin = service.createNewPin(mockForm, mockUserData);
    expect(pin).toEqual(mockPin);
  }));

});
