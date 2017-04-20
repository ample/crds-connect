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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HostApplicationComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule, AlertModule
      ],
      providers: [
        HostApplicationHelperService,
        IFrameParentService,
        StoreService,
        StateService,
        SessionService,
        CookieService,
        Angulartics2,
        LoginRedirectService,
        PinService,
        BlandPageService,
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



