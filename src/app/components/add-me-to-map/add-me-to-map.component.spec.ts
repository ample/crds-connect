import { MockComponent } from '../../shared/mock.component';
import { HttpModule } from '@angular/http';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastsManager, ToastOptions } from 'ng2-toastr';

import { SelectModule } from 'angular2-select';

import { AgmCoreModule } from 'angular2-google-maps/core';
import { AddMeToTheMapHelperService } from '../../services/add-me-to-map-helper.service';
import { SiteAddressService } from '../../services/site-address.service';
import { AddMeToMapComponent } from './add-me-to-map.component';

import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { BlandPageService } from '../../services/bland-page.service';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { UserLocationService } from '../../services/user-location.service';
import { AddressService } from '../../services/address.service';
import { Location } from '@angular/common';

describe('Component: Add Me to the Map', () => {

  let mockLocation,
    mockAddMeToTheMapHelperService,
    mockBlandPageService,
    mockSessionService,
    mockStateService,
    mockContentService,
    mockUserLocationServicee,
    mockAddressService,
    mockToastsManager;


  beforeEach(() => {
    mockContentService = jasmine.createSpyObj<ContentService>('content', ['loadData', 'getContent']);
    mockLocation = jasmine.createSpyObj<Location>('location', ['back']);
    mockContentService = jasmine.createSpyObj<ContentService>('content', ['loadData']);
    mockAddMeToTheMapHelperService = jasmine.createSpyObj<AddMeToTheMapHelperService>('AddMeToTheMapHelperService', ['constructor']);
    mockBlandPageService = jasmine.createSpyObj<BlandPageService>('BlandPageService', ['constructor']);
    mockSessionService = jasmine.createSpyObj<SessionService>('sessionService', ['constructor']);
    mockStateService = jasmine.createSpyObj<StateService>('stateService', ['constructor']);
    mockAddressService = jasmine.createSpyObj<AddressService>('addressService', ['constructor']);
    mockToastsManager = jasmine.createSpyObj<ToastsManager>('toastsManager', ['constructor']);


    TestBed.configureTestingModule({
      declarations: [
        AddMeToMapComponent, 
        MockComponent({ selector: 'crds-content-block', inputs: ['id'] }),
        MockComponent({ selector: 'address-form', inputs: ['userData', 'buttonText', 'save'] })
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
        { provide: SessionService, useValue: mockSessionService },
        { provide: StateService, useValue: mockStateService },
        { provide: ContentService, useValue: mockContentService },
        { provide: Location, useValue: mockLocation },
        { provide: AddressService, useValue: mockAddressService },
        { provide: ToastsManager, useValue: mockToastsManager },
        { provide: UserLocationService, useValue: mockUserLocationServicee }
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
    document.querySelector('body').classList.remove('modal-open');//

    expect(document.querySelector('body').classList).not.toContain('modal-open');
    this.component.ngAfterViewInit();
    expect(document.querySelector('body').classList).toContain('modal-open');

    // Cleanup...
    document.querySelector('body').classList.remove('modal-open');
  });

  it('should go back when x is clicked', () => {
    this.component.closeClick();
    expect(this.component.location.back).toHaveBeenCalled();
  });

});
