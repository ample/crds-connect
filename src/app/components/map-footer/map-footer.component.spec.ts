/* tslint:disable:no-unused-variable */

import { NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { MockTestData } from '../../shared/MockTestData';
import { Observable } from 'rxjs/Rx';

import { ListHelperService } from '../../services/list-helper.service';
import { MapFooterComponent } from './map-footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SiteAddressService } from '../../services/site-address.service';
import { NeighborsHelperService } from '../../services/neighbors-helper.service';
import { PinService } from '../../services/pin.service';
import { SearchService } from '../../services/search.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { BlandPageService } from '../../services/bland-page.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { GoogleMapService } from '../../services/google-map.service';
import { UserLocationService } from  '../../services/user-location.service';
import { GeoCoordinates } from '../../models/geo-coordinates';
import { Pin, pinType } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';


describe('Component: MapFooter', () => {
    let fixture: ComponentFixture<MapFooterComponent>;
    let comp: MapFooterComponent;
    let mockPinService;
    let mockMapHelperService;
    let mockLoginRedirectService;
    let mockNeighborsHelperService;
    let mockRouter;
    let mockStateService;
    let mockSessionService;
    let mockBlandPageService;
    let mockUserLocationService;

    beforeEach(() => {
        mockSessionService = jasmine.createSpyObj<SessionService>('session', ['getContactId', 'isLoggedIn']);
        mockPinService = jasmine.createSpyObj<PinService>('pinService', ['getPinSearchResults']);
        mockLoginRedirectService = jasmine.createSpyObj<LoginRedirectService>('loginRedirectService', ['redirectToLogin']);
        mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['primeAndGo', 'goToDefaultError']);
        mockStateService = jasmine.createSpyObj<StateService>(
            'state', ['setLoading', 'setPageHeader', 'setCurrentView', 'setMyViewOrWorldView', 'getCurrentView']);
        mockMapHelperService = jasmine.createSpyObj<GoogleMapService>('mapHlpr', ['setLoading', 'setPageHeader']);
        mockNeighborsHelperService = jasmine.createSpyObj<NeighborsHelperService>('neighborsHelper', ['setLoading', 'setPageHeader']);
        mockUserLocationService = jasmine.createSpyObj<UserLocationService>(
            'userLocationService', ['setLoading', 'setPageHeader', 'GetUserLocation']);

        TestBed.configureTestingModule({
            declarations: [
                MapFooterComponent
            ],
            providers: [
                { provide: PinService, useValue: mockPinService },
                { provide: SessionService, useValue: mockSessionService },
                { provide: LoginRedirectService, useValue: mockLoginRedirectService },
                { provide: BlandPageService, useValue: mockBlandPageService },
                { provide: StateService, useValue: mockStateService },
                { provide: GoogleMapService, useValue: mockMapHelperService },
                { provide: NeighborsHelperService, useValue: mockNeighborsHelperService },
                { provide: UserLocationService, useValue: mockUserLocationService }
            ],
            imports: [
                RouterTestingModule.withRoutes([])
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(MapFooterComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('should create an instance', () => {
        expect(comp).toBeTruthy();
    });

  it('should get my stuff and init map', () => {
    let searchResults = MockTestData.getAPinSearchResults(3, 0, 0, 98789, 3, pinType.GATHERING, 1);
    let position = new GeoCoordinates(88, 40);

    (<jasmine.Spy>mockSessionService.isLoggedIn).and.returnValue(true);
    (<jasmine.Spy>mockUserLocationService.GetUserLocation).and.returnValue(Observable.of(position));
    (<jasmine.Spy>mockPinService.getPinSearchResults).and.returnValue(Observable.of(searchResults));

    spyOn(comp.searchResultsEmitter, 'emit');

    comp.myStuffBtnClicked();
    expect(comp.myPinSearchResults).toBeTruthy();
  });

});
