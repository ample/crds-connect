/* tslint:disable:no-unused-variable */

import { HttpModule } from '@angular/http';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieService } from 'angular2-cookie/core';

import { SelectModule } from 'angular2-select';

import { AgmCoreModule } from 'angular2-google-maps/core';
import { AddMeToTheMapHelperService } from '../../services/add-me-to-map-helper.service';
import { AddressFormComponent } from '../address-form/address-form.component';
import { SiteAddressService } from '../../services/site-address.service';
import { LocationService } from '../../services/location.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { AddMeToMapComponent } from './add-me-to-map.component';

import { SessionService } from '../../services/session.service';
import { GoogleMapService } from '../../services/google-map.service';
import { IPService } from '../../services/ip.service';
import { StateService } from '../../services/state.service';
import { PinService } from '../../services/pin.service';
import { BlandPageService } from '../../services/bland-page.service';
import { ContentBlockModule } from 'crds-ng2-content-block';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { UserLocationService } from '../../services/user-location.service';

describe('Component: Add Me to the Map', () => {

  let mockContentService;

  beforeEach(() => {
    mockContentService = jasmine.createSpyObj<ContentService>('content', ['loadData']);

    TestBed.configureTestingModule({
      declarations: [
        AddMeToMapComponent, AddressFormComponent
      ],
      imports: [
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyArKsBK97N0Wi-69x10OL7Sx57Fwlmu6Cs'
        }),
        HttpModule,
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        SelectModule,
        ContentBlockModule.forRoot({ categories: ['common'] })
      ],
      providers: [
        AddMeToTheMapHelperService,
        BlandPageService,
        CookieService,
        { provide: ContentService, useValue: mockContentService },
        IPService,
        SiteAddressService,
        PinService,
        LocationService,
        LoginRedirectService,
        SessionService,
        StateService,
        GoogleMapService,
        BlandPageService,
        UserLocationService
      ]
    });
    this.fixture = TestBed.createComponent(AddMeToMapComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});



