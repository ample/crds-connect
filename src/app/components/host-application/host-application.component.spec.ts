import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule  } from '@angular/http';
import { ContentService } from 'crds-ng2-content-block';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { DetailedUserData } from '../../models/detailed-user-data';
import { AddressService } from '../../services/address.service';
import { GroupService } from '../../services/group.service';
import { HostApplicationHelperService } from '../../services/host-application-helper.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { MockTestData } from '../../shared/MockTestData';
import { HostApplicationComponent } from './host-application.component';

// TODO: Finish Unit Testing this Component
describe('HostApplicationComponent', () => {
  let fixture: ComponentFixture<HostApplicationComponent>;
  let comp: HostApplicationComponent;
  let el;
  let mockAddressService,
    mockContentService,
    mockHostApplicationHlpr,
    mockLocationService,
    mockRouter,
    mockStateService,
    mockSessionService,
    mockToastsManager;
  let userData: DetailedUserData;

  beforeEach(() => {
    mockContentService = jasmine.createSpyObj<ContentService>('content', ['getContent']);
    mockStateService = jasmine.createSpyObj<StateService>('stateService', ['setLoading']);
    mockSessionService = jasmine.createSpyObj<SessionService>('sessionService', ['postHostApplication']);
    mockToastsManager = jasmine.createSpyObj<ToastsManager>('toast', ['error']);
    mockLocationService = jasmine.createSpyObj<Location>('location', ['back']);
    mockHostApplicationHlpr = jasmine.createSpyObj<HostApplicationHelperService>('hlpr', ['formatPhoneForUi', 'stripHtmlFromString']);
    mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
    userData = MockTestData.getADetailedUserData();
    TestBed.configureTestingModule({
      declarations: [
        HostApplicationComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AddressService, useValue: mockAddressService },
        { provide: ContentService, useValue: mockContentService },
        { provide: HostApplicationHelperService, useValue: mockHostApplicationHlpr },
        { provide: Location, useValue: mockLocationService },
        { provide: StateService, useValue: mockStateService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: ToastsManager, useValue: mockToastsManager },
        { provide: ActivatedRoute, useValue: { snapshot: { data: { userData: userData } } } },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(HostApplicationComponent);
      comp = fixture.componentInstance;

      // el = fixture.debugElement.query(By.css('h1'));
    });
  }));

  it('should create an instance', () => {
    expect(comp).toBeTruthy();
  });

  it('should initially hide the second address form', () => {
    const groupAddressForm = fixture.debugElement.query(By.css('#gatheringAddressForm'));
    expect(groupAddressForm).toBeFalsy();
  });

  it('should init', () => {
    (mockHostApplicationHlpr.formatPhoneForUi).and.returnValue(1231231234);
    let contentReturned = 'Hey this is some content';
    (mockContentService.getContent).and.returnValue(contentReturned);
    (mockHostApplicationHlpr.stripHtmlFromString).and.returnValue(contentReturned);
    comp.ngOnInit();
    expect(mockHostApplicationHlpr.formatPhoneForUi).toHaveBeenCalledWith(userData.mobilePhone);
    expect(mockContentService.getContent).toHaveBeenCalledWith('defaultGatheringDesc');
    expect(mockHostApplicationHlpr.stripHtmlFromString).toHaveBeenCalledWith(contentReturned);
    expect(mockStateService.setLoading).toHaveBeenCalledTimes(1);
    expect(comp['userData']).toBe(userData);
  });

  it('validate phone length - min not met', () => {
      comp.ngOnInit();
      comp.hostForm.controls['contactNumber'].setValue('123');
      expect(comp.hostForm.controls['contactNumber'].valid).toBeFalsy();
  });

  it('validate phone length - correct length', () => {
      comp.ngOnInit();
      comp.hostForm.controls['contactNumber'].setValue('1234567890');
      expect(comp.hostForm.controls['contactNumber'].valid).toBeTruthy();
  });
});
