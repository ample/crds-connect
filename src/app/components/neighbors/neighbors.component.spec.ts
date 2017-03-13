/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { APIService } from '../../services/api.service';
import { Http, Response, RequestOptions } from '@angular/http';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { UserLocationService } from '../../services/user-location.service';
import { NeighborsComponent } from './neighbors.component';
import { ListViewComponent } from '../../components/list-view/list-view.component';
import { MapComponent } from '../../components/map/map.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { MapContentComponent } from '../../components/map-content/map-content.component';
import { MapFooterComponent } from '../map-footer/map-footer.component';
import { FormsModule }   from '@angular/forms';
import { ContentService } from '../../services/content.service';
import { IFrameParentService } from '../../services/iframe-parent.service';
import { SessionService } from '../../services/session.service';
import { GoogleMapService } from '../../services/google-map.service';
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
import { GoogleMapClusterDirective } from  '../../directives/google-map-cluster.directive';

describe('Component: Neighbors', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NeighborsComponent,
        MapContentComponent,
        MapFooterComponent,
        ListFooterComponent,
        ListViewComponent,
        SearchBarComponent,
        MapComponent,
        GoogleMapClusterDirective
      ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule, AlertModule, FormsModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyArKsBK97N0Wi-69x10OL7Sx57Fwlmu6Cs'
        })
      ],
      providers: [
        UserLocationService,
        LocationService,
        PinService,
        IFrameParentService,
        GoogleMapService,
        StoreService,
        StateService,
        ListHelperService,
        APIService,
        SessionService,
        CookieService,
        Angulartics2,
        ContentService,
        LoginRedirectService
      ]
    });
    this.fixture = TestBed.createComponent(NeighborsComponent);
    this.component = this.fixture.componentInstance;

  });

it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});
