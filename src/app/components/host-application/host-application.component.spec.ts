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

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AddressService } from '../../services/address.service';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { HostApplicationHelperService } from '../../services/host-application-helper.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { PinService } from '../../services/pin.service';

import { HostApplicationComponent } from './host-application.component';

import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';

describe('Component: Host Application', () => {

  let component;
  let fixture;
  let   mockAddressService,
        mockStateService,
        mockSessionService,
        mockContentService,
        mockToastsManager,
        mockValidate;

  beforeEach(() => {
        mockStateService = { setLoading: jest.fn() };
        mockValidate = { minLength: jest.fn(), maxLength: jest.fn(), required: jest.fn() };
        mockContentService = { getContent: jest.fn() };
        mockToastsManager = { error: jest.fn(), success: jest.fn() };
        mockSessionService = { postHostApplication: jest.fn() };
        mockAddressService = { emitClearGroupAddressForm: jest.fn() };

    TestBed.configureTestingModule({
      declarations: [
        HostApplicationComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule, AlertModule
      ],
      providers: [
        { provide: AddressService, useValue: mockAddressService },
        ContentService,
        HostApplicationHelperService,
        { provide: StateService, useValue: mockStateService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Validators, useValue: mockValidate },
        { provide: ToastsManager, useValue: mockToastsManager },
        { provide: ContentService, useValue: mockContentService }
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
