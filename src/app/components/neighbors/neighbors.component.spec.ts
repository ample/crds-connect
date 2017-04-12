/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { Http, Response, RequestOptions } from '@angular/http';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { CanvasMapOverlayComponent } from '../../components/canvas-map-overlay/canvas-map-overlay.component';
import { UserLocationService } from '../../services/user-location.service';
import { NeighborsComponent } from './neighbors.component';
import { ListViewComponent } from '../../components/list-view/list-view.component';
import { ListEntryComponent } from '../../components/list-entry/list-entry.component';
import { MapComponent } from '../../components/map/map.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { SearchLocalComponent } from '../../components/search-local/search-local.component';
import { MapContentComponent } from '../../components/map-content/map-content.component';
import { MapFooterComponent } from '../map-footer/map-footer.component';
import { FormsModule }   from '@angular/forms';
import { ContentBlockModule } from 'crds-ng2-content-block';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { SiteAddressService } from '../../services/site-address.service';
import { IFrameParentService } from '../../services/iframe-parent.service';
import { SessionService } from '../../services/session.service';
import { GoogleMapService } from '../../services/google-map.service';
import { NeighborsHelperService } from '../../services/neighbors-helper.service';
import { StateService } from '../../services/state.service';
import { StoreService } from '../../services/store.service';
import { SearchService } from '../../services/search.service';
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
import { BlandPageService } from '../../services/bland-page.service';
import { GeoCoordinates } from '../../models/geo-coordinates';
import { Pin } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';
import { IPService } from '../../services/ip.service';
import { MockComponent } from '../../shared/mock.component';

describe('Component: Neighbors', () => {

  let mockContentService;

  beforeEach(() => {
    mockContentService = jasmine.createSpyObj<ContentService>('content', ['loadData']);

    TestBed.configureTestingModule({
      declarations: [
        CanvasMapOverlayComponent,
        NeighborsComponent,
        MapContentComponent,
        MapFooterComponent,
        ListFooterComponent,
        ListViewComponent,
        ListEntryComponent,
        SearchBarComponent,
        MapComponent,
        SearchLocalComponent,
        GoogleMapClusterDirective,
        MockComponent({selector: 'profile-picture', inputs: ['contactId', 'wrapperClass', 'imageClass']})
      ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule, AlertModule, FormsModule,
        ContentBlockModule.forRoot({ categories: ['main'] }),
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyArKsBK97N0Wi-69x10OL7Sx57Fwlmu6Cs'
        }),
        ContentBlockModule.forRoot({ categories: ['common'] })
      ],
      providers: [
        SiteAddressService,
        UserLocationService,
        LocationService,
        PinService,
        IFrameParentService,
        GoogleMapService,
        NeighborsHelperService,
        StoreService,
        StateService,
        SearchService,
        ListHelperService,
        SessionService,
        CookieService,
        Angulartics2,
        { provide: ContentService, useValue: mockContentService },
        LoginRedirectService,
        BlandPageService,
        IPService
      ]
    });
    this.fixture = TestBed.createComponent(NeighborsComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  it('should init map with existing results', () => {
    this.component.haveResults = true;
    this.component.ngOnInit();
    expect(this.component.pinSearchResults).toBeTruthy();
  });

  it('should init map and get new results', () => {
    this.component.haveResults = false;
    this.fixture.pinSearchResults = new PinSearchResultsDto(new GeoCoordinates(0, 0), new Array<Pin>());
    this.component.ngOnInit();
    expect(this.component.pinSearchResults).toBeTruthy();
  });

});
