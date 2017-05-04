import { BlandPageDetails, BlandPageCause, BlandPageType } from '../../models/bland-page-details';
import { PinService } from '../../services/pin.service';
import { MockComponent } from '../../shared/mock.component';
import { HttpModule } from '@angular/http';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

import { ToastsManager, ToastOptions } from 'ng2-toastr';
import { SelectModule } from 'angular2-select';

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


describe('Component: Add Me to the Map', () => {

  let mockLocation,
    mockBlandPageService,
    mockSessionService,
    mockState,
    mockContentService,
    mockUserLocationServicee,
    mockAddressService,
    mockToastsManager,
    mockPinService;


  beforeEach(() => {
    mockContentService = { loadData: jest.fn(), getContent: jest.fn()};
    mockLocation = { back: jest.fn() };
    mockBlandPageService = {primeAndGo: jest.fn()};
    mockSessionService = { clearCache: jest.fn()};
    mockState = { setMyViewOrWorldView: jest.fn(), setCurrentView: jest.fn(), setloading: jest.fn(), setLastSearch: jest.fn()};
    mockAddressService = { constructor: jest.fn() };
    mockToastsManager = { constructor: jest.fn() };
    mockPinService = { postPin: jest.fn() };

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
        { provide: PinService, useValue: mockPinService }
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

  it('should setSubmissionErrorWarningTo', () => {
    this.component.setSubmissionErrorWarningTo(true);
    expect(this.component.submissionError).toBe(true);

    this.component.setSubmissionErrorWarningTo(false);
    expect(this.component.submissionError).toBe(false);
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
        console.log(mockPinService);
        mockPinService.postPin.mockReturnValueOnce(Observable.of(pin));
        this.component.onSubmit(this.component.addressFormGroup);
        expect(mockPinService.postPin).toHaveBeenCalledWith(pin);
        expect(mockBlandPageService.primeAndGo).toHaveBeenCalledWith(expectedBpd);
        expect(mockState.setMyViewOrWorldView).toHaveBeenCalledWith('world');
        expect(mockState.setCurrentView).toHaveBeenCalledWith('map');
        expect(mockState.setLastSearch).toHaveBeenCalledWith(null);
        expect(mockSessionService.clearCache).toHaveBeenCalled();

    });

});
