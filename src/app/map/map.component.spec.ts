/* tslint:disable:no-unused-variable */
import { Angulartics2 } from 'angulartics2';
import { CookieService } from 'angular2-cookie/core';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule  } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AgmCoreModule } from 'angular2-google-maps/core';
import { APIService } from '../services/api.service';
import { ContentService } from '../services/content.service';
import { IFrameParentService } from '../services/iframe-parent.service';
import { SessionService } from '../services/session.service';
import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';
import { LoginRedirectService } from '../services/login-redirect.service';
import { LocationService } from '../services/location.service';

import { MapComponent } from './map.component';

import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';

describe('Component: Map', () => {

  let component;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MapComponent
      ],
      imports: [
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyArKsBK97N0Wi-69x10OL7Sx57Fwlmu6Cs'
        }),
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule, AlertModule
      ],
      providers: [
        IFrameParentService,
        StoreService,
        StateService,
        APIService,
        SessionService,
        CookieService,
        Angulartics2,
        ContentService,
        LoginRedirectService,
        LocationService
      ]
    });
    this.fixture = TestBed.createComponent(MapComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});



