/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { APIService } from '../../services/api.service';
import { Http, Response, RequestOptions } from '@angular/http';
import { AgmCoreModule } from 'angular2-google-maps/core';

import { UserLocationService } from '../../services/user-location.service';
import { ListViewComponent } from './list-view.component';
import { ListEntryComponent } from '../list-entry/list-entry.component';
import { MapContentComponent } from '../../components/map-content/map-content.component';
import { MapFooterComponent } from '../map-footer/map-footer.component';
import { GoogleMapService } from '../../services/google-map.service';

import { ContentService } from '../../services/content.service';
import { IFrameParentService } from '../../services/iframe-parent.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { StoreService } from '../../services/store.service';
import { ListHelperService } from '../../services/list-helper.service';
import { ListFooterComponent } from '../../components/list-footer/list-footer.component';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { Angulartics2 } from 'angulartics2';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule  } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';
import { LocationService } from '../../services/location.service';
import { PinService}  from '../../services/pin.service';


describe('Component: List View', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListViewComponent,
        ListEntryComponent,
        ListFooterComponent,
        MapContentComponent,
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
        ListHelperService,
        SessionService,
        CookieService,
        Angulartics2,
        ContentService,
        LoginRedirectService,
        GoogleMapService
      ]
    });
    this.fixture = TestBed.createComponent(ListViewComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});



