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
import { GatheringService } from '../../services/gathering.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { AddMeToMapComponent } from './add-me-to-map.component';
import { SessionService } from '../../services/session.service';
import { GoogleMapService } from '../../services/google-map.service';
import { StateService } from '../../services/state.service';
import { PinService } from '../../services/pin.service';
import { BlandPageService } from '../../services/bland-page.service';
import { ContentBlockModule } from 'crds-ng2-content-block';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';

describe('Component: Add Me to the Map', () => {

  let mockAddMeToTheMapHelperService,
    mockBlandPageService,
    mockCookieService,
    mockGatheringService,
    mockPinService,
    mockLoginRedirectService,
    mockSessionService,
    mockStateService,
    mockContentService,
    mockGoogleMapService;

  beforeEach(() => {

    mockAddMeToTheMapHelperService = jasmine.createSpyObj<AddMeToTheMapHelperService>('AddMeToTheMapHelperService', ['constructor']);
    mockBlandPageService = jasmine.createSpyObj<BlandPageService>('BlandPageService', ['constructor']);
    mockCookieService = jasmine.createSpyObj<CookieService>('cookieService', ['constructor']);
    mockGatheringService = jasmine.createSpyObj<GatheringService>('gatheringService', ['constructor']);
    mockPinService = jasmine.createSpyObj<PinService>('pinService', ['constructor']);
    mockLoginRedirectService = jasmine.createSpyObj<LoginRedirectService>('loginRedirectService', ['constructor']);
    mockSessionService = jasmine.createSpyObj<SessionService>('sessionService', ['constructor']);
    mockStateService = jasmine.createSpyObj<StateService>('stateService', ['constructor']);
    mockContentService = jasmine.createSpyObj<ContentService>('contentService', ['loadData']);
    mockGoogleMapService = jasmine.createSpyObj<GoogleMapService>('mapService', ['constructor']);

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
        { provide: AddMeToTheMapHelperService, useValue: mockAddMeToTheMapHelperService },
        { provide: BlandPageService, useValue: mockBlandPageService },
        { provide: CookieService, useValue: mockCookieService },
        { provide: GatheringService, useValue: mockGatheringService },
        { provide: PinService, useValue: mockPinService },
        { provide: LoginRedirectService, useValue: mockLoginRedirectService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: StateService, useValue: mockStateService },
        { provide: ContentService, useValue: mockContentService },
        { provide: GoogleMapService, useValue: mockGoogleMapService }
      ]
    });
    this.fixture = TestBed.createComponent(AddMeToMapComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});



