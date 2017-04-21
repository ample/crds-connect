/* tslint:disable:no-unused-variable */
import { Angulartics2 } from 'angulartics2';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule  } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';

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
        mockBlandPageService;

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


    TestBed.configureTestingModule({
      declarations: [
        HostApplicationComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule, AlertModule
      ],
      providers: [
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

});



