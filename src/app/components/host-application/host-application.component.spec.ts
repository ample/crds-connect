/* tslint:disable:no-unused-variable */
import { Angulartics2 } from 'angulartics2';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule  } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';

import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { IFrameParentService } from '../../services/iframe-parent.service';
import { HostApplicationHelperService } from '../../services/host-application-helper.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { StoreService } from '../../services/store.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { PinService } from '../../services/pin.service';
import { BlandPageService } from '../../services/bland-page.service';

import { HostApplicationComponent } from './host-application.component';

import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';

describe('Component: Host Application', () => {

  let component;
  let fixture;
  let   mockIFrameParentService,
        mockStoreService,
        mockStateService,
        mockSessionService,
        mockCookieService,
        mockAngulartics2,
        mockLoginRedirectService,
        mockPinService,
        mockBlandPageService,
        mockValidate;

  beforeEach(() => {
        mockIFrameParentService = jasmine.createSpyObj<IFrameParentService>('iFrameParentService', ['constructor', 'getIFrameParentUrl']);
        mockStoreService = jasmine.createSpyObj<StoreService>('storeService', ['constructor']);
        mockStateService = jasmine.createSpyObj<StateService>('stateService', ['constructor']);
        mockSessionService = jasmine.createSpyObj<SessionService>('sessionService', ['constructor']);
        mockCookieService = jasmine.createSpyObj<CookieService>('cookieService', ['constructor']);
        mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angularTics', ['constuctor']);
        mockLoginRedirectService = jasmine.createSpyObj<LoginRedirectService>('loginRedirectService', ['constructor']);
        mockPinService = jasmine.createSpyObj<PinService>('pinService', ['constructor']);
        mockBlandPageService = jasmine.createSpyObj<BlandPageService>('BlandPageService', ['constructor']);
        mockValidate = jasmine.createSpyObj<Validators>('Validators', ['minLength', 'maxLength', 'required']);

    TestBed.configureTestingModule({
      declarations: [
        HostApplicationComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule, AlertModule
      ],
      providers: [
        ContentService,
        HostApplicationHelperService,
        { provide: IFrameParentService, useValue: mockIFrameParentService },
        { provide: StoreService, useValue: mockStoreService },
        { provide: StateService, useValue: mockStateService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: CookieService, useValue: mockCookieService },
        { provide: Angulartics2, useValue: mockAngulartics2 },
        { provide: LoginRedirectService, useValue: mockLoginRedirectService },
        { provide: PinService, useValue: mockPinService },
        { provide: BlandPageService, useValue: mockBlandPageService },
        { provide: Validators, useValue: mockValidate },
        ToastsManager,
        ToastOptions
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    this.fixture = TestBed.createComponent(HostApplicationComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  it('validate phone length, min not met', () => {
    expect(mockValidate.minLength(new FormControl('123'))).toBeFalsy();
  });
  it('should initiate with the "use home address for group" checkbox ticked', () => {
    const isHomeAddressCheckbox = this.fixture.debugElement.query(By.css('#isHomeAddress')).nativeElement;
    expect(isHomeAddressCheckbox.checked).toBeTruthy();
  });

  it('validate phone length - correct length', () => {
    expect(mockValidate.minLength(new FormControl('1235551234'))).toEqual(undefined);
  });
  it('should initially hide the second address form', () => {
    const groupAddressForm = this.fixture.debugElement.query(By.css('#gatheringAddressForm'));
    expect(groupAddressForm).toBeFalsy();
  });

});
