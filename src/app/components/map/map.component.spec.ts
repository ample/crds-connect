/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { CanvasMapOverlayComponent } from '../../components/canvas-map-overlay/canvas-map-overlay.component';
import { Http, Response, RequestOptions } from '@angular/http';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { UserLocationService } from '../../services/user-location.service';
import { MapComponent } from '../../components/map/map.component';
import { SearchLocalComponent } from '../search-local/search-local.component'
import { MapContentComponent } from '../../components/map-content/map-content.component';
import { MapFooterComponent } from '../map-footer/map-footer.component';

import { ContentService } from '../../services/content.service';
import { IFrameParentService } from '../../services/iframe-parent.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { StoreService } from '../../services/store.service';
import { GoogleMapService } from '../../services/google-map.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { Angulartics2 } from 'angulartics2';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule  } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';
import { LocationService } from '../../services/location.service';
import { PinService}  from '../../services/pin.service';
import { GoogleMapClusterDirective } from  '../../directives/google-map-cluster.directive';
import { BlandPageService } from '../../services/bland-page.service';
import { MapSettings } from '../../models/map-settings';
import { IPService } from '../../services/ip.service';

import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { SearchLocalService } from '../../services/search-local.service';

import { MapView } from '../../models/map-view';

describe('Component: Map', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CanvasMapOverlayComponent,
        MapComponent,
        MapContentComponent,
        MapFooterComponent,
        GoogleMapClusterDirective,
        SearchLocalComponent
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
        GoogleMapService,
        IFrameParentService,
        StoreService,
        StateService,
        SessionService,
        CookieService,
        Angulartics2,
        ContentService,
        LoginRedirectService,
        BlandPageService,
        IPService,
        GoogleMapsAPIWrapper,
        SearchLocalService
      ]
    });
    this.fixture = TestBed.createComponent(MapComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  it('should init map with existing results', () => {
    this.component.haveResults = true;
    this.fixture.searchResults = new MapSettings(null, null, 5, false, true);
    this.component.ngOnInit();
    expect(this.component.mapSettings.lat).toBeTruthy();
    expect(this.component.mapSettings.lng).toBeTruthy();
  });

  it('should init map and get new results', () => {
    this.component.haveResults = false;
    this.fixture.searchResults = new MapSettings(null, null, 5, false, true);
    this.component.ngOnInit();
    expect(this.component.mapSettings.lat).toBeTruthy();
    expect(this.component.mapSettings.lng).toBeTruthy();
  });

});
