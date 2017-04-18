import { MockComponent } from '../../shared/mock.component';
import { HttpModule } from '@angular/http';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieService } from 'angular2-cookie/core';
import { ToastsManager, ToastOptions } from 'ng2-toastr';

import { SelectModule } from 'angular2-select';

import { AgmCoreModule } from 'angular2-google-maps/core';
import { AddMeToTheMapHelperService } from '../../services/add-me-to-map-helper.service';
import { AddressFormComponent } from '../address-form/address-form.component';
import { SiteAddressService } from '../../services/site-address.service';
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
import { AddressService } from '../../services/address.service';
import { Location } from '@angular/common';
import { LocationService } from '../../services/location.service';

describe('Component: Add Me to the Map', () => {

  let mockLocation;
  let mockAddMeToTheMapHelperService,
    mockBlandPageService,
    mockCookieService,
    mockPinService,
    mockLoginRedirectService,
    mockSessionService,
    mockStateService,
    mockContentService,
    mockGoogleMapService,
    mockIPService, 
    mockUserLocationServicee,
    mockLocationService;


  beforeEach(() => {
    mockContentService = jasmine.createSpyObj<ContentService>('content', ['loadData', 'getContent']);
    mockLocation = jasmine.createSpyObj<Location>('location', ['back']);
    mockContentService = jasmine.createSpyObj<ContentService>('content', ['loadData']);

    mockAddMeToTheMapHelperService = jasmine.createSpyObj<AddMeToTheMapHelperService>('AddMeToTheMapHelperService', ['constructor']);
    mockBlandPageService = jasmine.createSpyObj<BlandPageService>('BlandPageService', ['constructor']);
    mockCookieService = jasmine.createSpyObj<CookieService>('cookieService', ['constructor']);
    mockPinService = jasmine.createSpyObj<PinService>('pinService', ['constructor']);
    mockLoginRedirectService = jasmine.createSpyObj<LoginRedirectService>('loginRedirectService', ['constructor']);
    mockSessionService = jasmine.createSpyObj<SessionService>('sessionService', ['constructor']);
    mockStateService = jasmine.createSpyObj<StateService>('stateService', ['constructor']);
    mockContentService = jasmine.createSpyObj<ContentService>('contentService', ['loadData']);
    mockGoogleMapService = jasmine.createSpyObj<GoogleMapService>('mapService', ['constructor']);
    mockIPService = jasmine.createSpyObj<GoogleMapService>('IPService', ['constructor']);

    TestBed.configureTestingModule({
      declarations: [
        AddMeToMapComponent, AddressFormComponent,
        MockComponent({selector: 'crds-content-block', inputs: ['id']})
      ],
      imports: [
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyArKsBK97N0Wi-69x10OL7Sx57Fwlmu6Cs'
        }),
        HttpModule,
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        SelectModule
      ],
      providers: [
        { provide: AddMeToTheMapHelperService, useValue: mockAddMeToTheMapHelperService },
        { provide: BlandPageService, useValue: mockBlandPageService },
        { provide: CookieService, useValue: mockCookieService },
        { provide: PinService, useValue: mockPinService },
        { provide: LoginRedirectService, useValue: mockLoginRedirectService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: StateService, useValue: mockStateService },
        { provide: ContentService, useValue: mockContentService },
        IPService,
        SiteAddressService,
        PinService,
        LocationService,
        { provide: Location, useValue: mockLocation },
        LoginRedirectService,
        SessionService,
        StateService,
        GoogleMapService,
        BlandPageService,
        UserLocationService,
        AddressService,
        ToastsManager,
        ToastOptions,
        IPService,
        PinService,
        LocationService,
        LoginRedirectService,
        SessionService,
        StateService,
        GoogleMapService,
        BlandPageService,
        UserLocationService,
        { provide: GoogleMapService, useValue: mockGoogleMapService },
        { provide: IPService, useValue: mockIPService }, 
        { provide: UserLocationService, useValue: mockUserLocationServicee }, 
        { provide: LocationService, useValue: mockLocationService }
      ]
    });
    this.fixture = TestBed.createComponent(AddMeToMapComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  it('should attach class selector to body element after view init', () => {
    // Start fresh...
    document.querySelector('body').classList.remove('modal-open');

    expect(document.querySelector('body').classList).not.toContain('modal-open');
    this.component.ngAfterViewInit();
    expect(document.querySelector('body').classList).toContain('modal-open');

    // Cleanup...
    document.querySelector('body').classList.remove('modal-open');
  });

  it('should go back when x is clicked', () => {
    this.component.closeClick();
    expect(mockLocation.back).toHaveBeenCalled();
  });

});
