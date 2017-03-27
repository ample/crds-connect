/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { Http, Response, RequestOptions } from '@angular/http';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { UserLocationService } from './/user-location.service';
import { MapComponent } from '../components/map/map.component';
import { MapContentComponent } from '../components/map-content/map-content.component';
import { MapFooterComponent } from '../components/map-footer/map-footer.component';
import { GeoCoordinates } from '../models/geo-coordinates';

import { ContentService } from './/content.service';
import { IFrameParentService } from './/iframe-parent.service';
import { SessionService } from './/session.service';
import { StateService } from './/state.service';
import { StoreService } from './/store.service';
import { GoogleMapService } from './/google-map.service';
import { LoginRedirectService } from './/login-redirect.service';
import { Angulartics2 } from 'angulartics2';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule  } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';
import { LocationService } from './/location.service';
import { PinService}  from './/pin.service';
import { GoogleMapClusterDirective } from  '../directives/google-map-cluster.directive';

describe('Service: Google Map', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MapComponent,
        MapContentComponent,
        MapFooterComponent,
        GoogleMapClusterDirective
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
        LoginRedirectService
      ]
    });
    this.fixture = TestBed.createComponent(MapComponent);
    this.component = this.fixture.componentInstance;

  });


  xit('should emit geo-coordinates', () => {

    const testCoords: GeoCoordinates = new GeoCoordinates(44, 44);

    spyOn(this.component.mapHlpr, 'emitRefreshMap');
    this.component.mapHlpr.emitRefreshMap(testCoords);
    this.fixture.detectChanges();
    expect(this.component.mapHlpr.emitRefreshMap).toHaveBeenCalledWith(testCoords);

  });

});
