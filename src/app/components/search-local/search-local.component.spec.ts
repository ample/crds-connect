/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { Http, Response, RequestOptions } from '@angular/http';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { UserLocationService } from '../../services/user-location.service';
import { MapComponent } from '../../components/map/map.component';
import { SearchLocalComponent } from '../search-local/search-local.component'
import { MapContentComponent } from '../../components/map-content/map-content.component';
import { MapFooterComponent } from '../map-footer/map-footer.component';
import { CanvasMapOverlayComponent } from '../../components/canvas-map-overlay/canvas-map-overlay.component';

import { GatheringService } from '../../services/gathering.service';
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
import { PinLabelService } from '../../services/pin-label.service';
import { PinService}  from '../../services/pin.service';
import { GoogleMapClusterDirective } from  '../../directives/google-map-cluster.directive';
import { BlandPageService } from '../../services/bland-page.service';
import { MapSettings } from '../../models/map-settings';
import { IPService } from '../../services/ip.service';

import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { SearchLocalService } from '../../services/search-local.service';

describe('Component: SearchLocal', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MapComponent,
        MapContentComponent,
        MapFooterComponent,
        GoogleMapClusterDirective,
        SearchLocalComponent,
        CanvasMapOverlayComponent
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
        PinLabelService,
        PinService,
        GatheringService,
        GoogleMapService,
        IFrameParentService,
        StoreService,
        StateService,
        SessionService,
        CookieService,
        Angulartics2,
        LoginRedirectService,
        BlandPageService,
        GoogleMapsAPIWrapper,
        SearchLocalService,
        IPService
      ]
    });
    this.fixture = TestBed.createComponent(MapComponent);
    this.component = this.fixture.componentInstance;

    this.component.haveResults = true;
    this.fixture.searchResults = new MapSettings(null, null, 5, false, true);
    this.component.ngOnInit();
  });



  it('should not be present if mapView is unchanged', () => {
    let element = document.querySelector(".search-local button");
    expect(element).toBe(null);
  });

  // leave the following tests xit'ed because getting at the native elements
  // that need to be adjusted is an unknown for now.

  xit('should be present if mapView is zoomed', () => {
    // how do you get a handle to the *real* google map in a test?
    this.component.mapApiWrapper.getNativeMap().then((map) => {
      map.setZoom(map.getZoom() + 1);
    });
    let element = document.querySelector(".search-local button");
    expect(element).toBeDefined();
  });

  xit('should be present if mapView is panned', () => {
    // how do you get a handle to the *real* google map in a test?
    this.component.mapApiWrapper.getNativeMap().then((map) => {
      map.panBy(100,200);
    });
    let element = document.querySelector(".search-local button");
    expect(element).toBeDefined();
  });

  xit('should trigger a search when activated', () => {
    // ummm... this component is a Map, not a SearchLocal
    spyOn(this.component, "doLocalSearch");
    // how do you get a handle to the *real* google map in a test?
    this.component.mapApiWrapper.getNativeMap().then((map) => {
      map.panBy(100, 200);
    });
    expect(this.component.doLocalSearch).toHaveBeenCalled();
  });
});
