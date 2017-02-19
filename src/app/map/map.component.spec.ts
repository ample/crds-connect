/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { APIService } from '../services/api.service';
import { Http, Response, RequestOptions } from '@angular/http';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { UserLocationService } from '../services/user-location.service';
import { MapComponent } from './map.component';
import { MapFooterComponent } from '../components/map-footer/map-footer.component';

import { ContentService } from '../services/content.service';
import { IFrameParentService } from '../services/iframe-parent.service';
import { SessionService } from '../services/session.service';
import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';
import { LoginRedirectService } from '../services/login-redirect.service';
import { Angulartics2 } from 'angulartics2';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule  } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';
import { LocationService } from '../services/location.service';
import { PinService}  from '../services/pin.service';

describe('Component: Map', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MapComponent,
        MapFooterComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule, AlertModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyArKsBK97N0Wi-69x10OL7Sx57Fwlmu6Cs'
        })
      ],
      providers: [
        UserLocationService,
        LocationService,
        PinService,
        IFrameParentService,
        StoreService,
        StateService,
        APIService,
        SessionService,
        CookieService,
        Angulartics2,
        ContentService,
        LoginRedirectService
      ]
    });
    this.fixture = TestBed.createComponent(MapComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});



