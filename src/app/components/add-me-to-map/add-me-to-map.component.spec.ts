import { BlandPageDetails, BlandPageCause, BlandPageType } from '../../models/bland-page-details';
import { PinService } from '../../services/pin.service';
import { MockComponent } from '../../shared/mock.component';
import { HttpModule } from '@angular/http';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

import { ToastsManager, ToastOptions } from 'ng2-toastr';
import { SelectModule } from 'ng-select';

import { AgmCoreModule } from 'angular2-google-maps/core';
import { SiteAddressService } from '../../services/site-address.service';
import { AddMeToMapComponent } from './add-me-to-map.component';

import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { BlandPageService } from '../../services/bland-page.service';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { UserLocationService } from '../../services/user-location.service';
import { AddressService } from '../../services/address.service';
import { Location } from '@angular/common';
import { MockTestData } from '../../shared/MockTestData';
import { ViewType } from '../../shared/constants';

import { GoogleMapService } from '../../services/google-map.service';


describe('Component: Add Me to the Map', () => {

  let mockLocation,
    mockBlandPageService,
    mockSessionService,
    mockState,
    mockContentService,
    mockUserLocationServicee,
    mockAddressService,
    mockToastsManager,
    mockPinService,
    mockMapHlpr;


  beforeEach(() => {
    mockContentService = jasmine.createSpyObj<ContentService>('content', ['loadData', 'getContent']);
    mockLocation = jasmine.createSpyObj<Location>('location', ['back']);
    mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['primeAndGo']);
    mockSessionService = jasmine.createSpyObj<SessionService>('session', ['clearCache']);
    mockState = jasmine.createSpyObj<StateService>('state', ['getMyViewOrWorldView', 'setMyViewOrWorldView', 'setCurrentView', 'setLoading', 'setLastSearch', 'setMapView']);
    mockAddressService = jasmine.createSpyObj<AddressService>('addressService', ['constructor']);
    mockToastsManager = jasmine.createSpyObj<ToastsManager>('toastsManager', ['error']);
    mockPinService = jasmine.createSpyObj<PinService>('pinService', ['postPin']);
    mockMapHlpr = jasmine.createSpyObj<GoogleMapService>('mapHlpr', ['calculateZoom']);


    TestBed.configureTestingModule({
      declarations: [
        AddMeToMapComponent,
        MockComponent({ selector: 'crds-content-block', inputs: ['id'] }),
        MockComponent({ selector: 'address-form', inputs: ['address', 'parentForm', 'group', 'isFormSubmitted'] })
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
        { provide: BlandPageService, useValue: mockBlandPageService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: StateService, useValue: mockState },
        { provide: ContentService, useValue: mockContentService },
        { provide: Location, useValue: mockLocation },
        { provide: AddressService, useValue: mockAddressService },
        { provide: ToastsManager, useValue: mockToastsManager },
        { provide: UserLocationService, useValue: mockUserLocationServicee },
        { provide: PinService, useValue: mockPinService },
        { provide: GoogleMapService, useValue: mockMapHlpr}
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
    document.querySelector('body').classList.remove('fauxdal-open');

    expect(document.querySelector('body').classList).not.toContain('fauxdal-open');
    this.component.ngAfterViewInit();
    expect(document.querySelector('body').classList).toContain('fauxdal-open');

    // Cleanup...
    document.querySelector('body').classList.remove('fauxdal-open');
  });

  it('should go back when x is clicked', () => {
    this.component.closeClick();
    expect(this.component.location.back).toHaveBeenCalled();
  });

  it('should submit', () => {
    let pin = MockTestData.getAPin(1);
    this.component['userData'] = pin;
    let expectedBpd = new BlandPageDetails(
      'See for yourself',
      'finderNowAPin',
      BlandPageType.ContentBlock,
      BlandPageCause.Success,
      '',
      ''
    );

    (<jasmine.Spy>mockPinService.postPin).and.returnValue(Observable.of(pin));
    pin['valid'] = true;
    this.component.onSubmit(pin);
    expect(mockPinService.postPin).toHaveBeenCalledWith(pin);
    expect(mockBlandPageService.primeAndGo).toHaveBeenCalledWith(expectedBpd);
    expect(mockState.setMyViewOrWorldView).toHaveBeenCalledWith('world');
    expect(mockState.setCurrentView).toHaveBeenCalledWith(ViewType.MAP);
    expect(mockState.setLastSearch).toHaveBeenCalledWith(null);
    expect(mockSessionService.clearCache).toHaveBeenCalled();
    expect(mockState.setMapView).toHaveBeenCalled();
    expect(mockState.setLoading).toHaveBeenCalledTimes(2);
  });

  it('should handle error', () => {
    mockContentService.getContent.and.returnValue('Cool beans there was an error');
    mockPinService.postPin.and.returnValue(Observable.throw('oh noooo'));
    let pin = MockTestData.getAPin(1);
    this.component['userData'] = pin;
    pin['valid'] = true;
    this.component.onSubmit(pin);
    expect(mockPinService.postPin).toHaveBeenCalledWith(pin);
    expect(mockToastsManager.error).toHaveBeenCalledWith('Cool beans there was an error');
    expect(mockContentService.getContent).toHaveBeenCalledWith('generalError');
    expect(mockState.setLoading).toHaveBeenCalledTimes(2);
  });

});
