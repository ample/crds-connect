import { TestBed, inject, async } from '@angular/core/testing';

import { crdsOakleyCoords } from '../shared/constants';
import { GeoCoordinates } from '../models/geo-coordinates';
import { SessionService } from './session.service';
import { UserLocationService } from './user-location.service';

import { IFrameParentService } from '../services/iframe-parent.service';
import { SiteAddressService } from '../services/site-address.service';
import { GoogleMapService } from '../services/google-map.service';
import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';
import { LoginRedirectService } from '../services/login-redirect.service';
import { Angulartics2 } from 'angulartics2';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule  } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap';
import { LocationService } from '../services/location.service';
import { PinService}  from '../services/pin.service';
import { BlandPageService } from './bland-page.service';
import { IPService } from '../services/ip.service';

describe('Service: User-Location', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpModule,
          JsonpModule,
          ReactiveFormsModule,
          AlertModule
        ],
        providers: [
          SiteAddressService,
          GoogleMapService,
          UserLocationService,
          LocationService,
          PinService,
          IFrameParentService,
          StoreService,
          StateService,
          SessionService,
          CookieService,
          Angulartics2,
          LoginRedirectService,
          BlandPageService,
          IPService
        ]
    });
  });

  it('should create an instance', inject([UserLocationService], (service: any) => {
    expect(service).toBeTruthy();
  }));

  it('Should get the default Crds-Oakley coordinates', inject([UserLocationService], (service: any) => {
    expect(service.getUserLocationFromDefault()).toEqual(new GeoCoordinates(crdsOakleyCoords.lat, crdsOakleyCoords.lng));
  }));

  xit('Should get a location as a GeoCoordinates object', async(inject(
    [UserLocationService],
    (service) => {
      const resultObs = service.GetUserLocation();

      resultObs.subscribe(res => {
        expect(res).toEqual(jasmine.any(GeoCoordinates));
      });
  })));

  xit('Should get a location as a GeoCoordinates object from IP', async(inject(
      [UserLocationService],
      (service) => {
        const resultObs = service.getUserLocationFromIp();

        resultObs.subscribe(res => {
          expect(res).toEqual(jasmine.any(GeoCoordinates));
        });
      })));

});
