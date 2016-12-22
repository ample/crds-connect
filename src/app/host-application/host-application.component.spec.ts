/* tslint:disable:no-unused-variable */
import { Angulartics2 } from 'angulartics2';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule  } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

import { APIService } from '../services/api.service';
import { IFrameParentService } from '../services/iframe-parent.service';
import { SessionService } from '../services/session.service';
import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';
import { ValidationService } from '../services/validation.service';

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
        IFrameParentService,
        StoreService,
        ValidationService,
        StateService,
        APIService,
        SessionService,
        CookieService,
        ValidationService,
        Angulartics2
      ]
    });
    this.fixture = TestBed.createComponent(HostApplicationComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});



