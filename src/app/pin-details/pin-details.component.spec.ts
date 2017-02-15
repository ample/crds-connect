/* tslint:disable:no-unused-variable */
import { Angulartics2 } from 'angulartics2';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

import { APIService } from '../services/api.service';
import { ContentService } from '../services/content.service';
import { IFrameParentService } from '../services/iframe-parent.service';
import { SessionService } from '../services/session.service';
import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';
import { LoginRedirectService } from '../services/login-redirect.service';
import { PinService } from '../services/pin.service';

import { PinDetailsComponent } from './pin-details.component';


import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';

describe('Component: Pin-Details component', () => {

  let component;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PinDetailsComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule, AlertModule
      ],
      providers: [
        IFrameParentService,
        StoreService,
        StateService,
        APIService,
        SessionService,
        CookieService,
        PinService,
        Angulartics2,
        ContentService,
        LoginRedirectService
      ]
    });
    this.fixture = TestBed.createComponent(PinDetailsComponent);
    this.component = this.fixture.componentInstance;
    this.component.pin = {
      'firstName': 'Joe',
      'lastName': 'Kerstanoff',
      'emailAddress': 'jkerstanoff@callibrity.com',
      'contactId': 2562378,
      'participantId': 7537153,
      'address': {
        'addressId': 5272699,
        'addressLine1': '8854 Penfield Way',
        'addressLine2': null,
        'city': 'Maineville',
        'state': 'OH',
        'zip': '45039-9731',
        'foreignCountry': 'United States',
        'county': null,
        'longitude': null,
        'latitude': null
      },
      'hostStatus': 0,
      'gathering': null
    };

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  it('doesLoggedInUserOwnPin() should return true if contactId matches', inject([SessionService], (service:any) => {
    spyOn(service, 'getContactId').and.returnValue(2562378);
    let returnValue = this.component.doesLoggedInUserOwnPin();
    expect(returnValue).toBe(true);

  }));

  it('doesLoggedInUserOwnPin() should return false if contactId doesnt match', inject([SessionService], (service:any) => {
    spyOn(service, 'getContactId').and.returnValue(42);
    let returnValue = this.component.doesLoggedInUserOwnPin();
    expect(returnValue).toBe(false);
  }));

});



