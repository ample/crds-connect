import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { Address } from '../models/address';
import { HostApplicationHelperService } from './host-application-helper.service';
import { AddMeToMapFormFields } from '../models/add-me-to-map-form-fields';
import { SiteAddressService } from '../services/site-address.service';
import { Pin, pinType } from '../models/pin';

describe('Service: Add me to the Map Helper', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [HostApplicationHelperService, SiteAddressService]
    });
  });

it('should create an instance', inject([HostApplicationHelperService], (service: any) => {
    expect(service).toBeTruthy();
}));

});
