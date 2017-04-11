/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';

import { AgmCoreModule, GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { CanvasMapOverlayComponent } from '../components/canvas-map-overlay/canvas-map-overlay.component';
import { MapComponent } from '../components/map/map.component';
import { MapContentComponent } from '../components/map-content/map-content.component';
import { MapFooterComponent } from '../components/map-footer/map-footer.component';
import { SearchLocalComponent } from '../components/search-local/search-local.component';

import { BlandPageService } from '../services/bland-page.service';
import { IFrameParentService } from './/iframe-parent.service';
import { IPService } from '../services/ip.service';
import { NeighborsHelperService } from '../services/neighbors-helper.service';
import { SearchService } from '../services/search.service';
import { SessionService } from './/session.service';
import { StateService } from './/state.service';
import { StoreService } from './/store.service';
import { SiteAddressService } from '../services/site-address.service';
import { GoogleMapService } from './/google-map.service';
import { LoginRedirectService } from './/login-redirect.service';
import { Angulartics2 } from 'angulartics2';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import { PinLabelService } from '../services/pin-label.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule  } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';
import { LocationService } from './/location.service';
import { PinService}  from './/pin.service';
import { UserLocationService } from './/user-location.service';

import { GeoCoordinates } from '../models/geo-coordinates';

import { GoogleMapClusterDirective } from  '../directives/google-map-cluster.directive';

describe('Service: Google Map', () => {

  let mockHeightAdjustment = 4;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CanvasMapOverlayComponent,
        MapComponent,
        MapContentComponent,
        MapFooterComponent,
        SearchLocalComponent,
        GoogleMapClusterDirective
      ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule, AlertModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyArKsBK97N0Wi-69x10OL7Sx57Fwlmu6Cs'
        })
      ],
      providers: [
        BlandPageService,
        UserLocationService,
        IPService,
        LocationService,
        PinService,
        GoogleMapService,
        GoogleMapsAPIWrapper,
        IFrameParentService,
        NeighborsHelperService,
        PinLabelService,
        SearchService,
        SiteAddressService,
        StoreService,
        StateService,
        SessionService,
        CookieService,
        Angulartics2,
        LoginRedirectService
      ]
    });
    this.fixture = TestBed.createComponent(MapComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', inject([GoogleMapService], (service: GoogleMapService) => {
    expect(service).toBeTruthy();
  }));

  it('should get a height adjustment appropriate for a one-line label', inject([GoogleMapService], (service: GoogleMapService) => {
    let heightAdjustmentInPixels: number = service.getLabelHeightAdjustment(null, null, false);
    expect(heightAdjustmentInPixels).toEqual(mockHeightAdjustment);
  }));

  xit('should emit geo-coordinates', () => {

    const testCoords: GeoCoordinates = new GeoCoordinates(44, 44);

    spyOn(this.component.mapHlpr, 'emitRefreshMap');
    this.component.mapHlpr.emitRefreshMap(testCoords);
    this.fixture.detectChanges();
    expect(this.component.mapHlpr.emitRefreshMap).toHaveBeenCalledWith(testCoords);

  });

});
