/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { Address } from '../models/address';
import { GoogleMapService } from './google-map.service';
import { AddMeToMapFormFields } from '../models/add-me-to-map-form-fields';
import { Pin, pinType } from '../models/pin';
import { UserDataForPinCreation } from '../models/user-data-for-pin-creation';

describe('Service: Map service', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [GoogleMapService]
    });
  });

  it('should create an instance', inject([GoogleMapService], (service: any) => {
    // let pin: Pin = service.createNewPin(mockForm, mockUserData);
    // expect(pin).toEqual(mockPin);
  }));

});
