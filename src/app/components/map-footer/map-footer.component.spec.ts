/* tslint:disable:no-unused-variable */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';

import { ListHelperService } from '../../services/list-helper.service';
import { MapFooterComponent } from './map-footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { GatheringService } from '../../services/gathering.service';
import { NeighborsHelperService } from '../../services/neighbors-helper.service';
import { PinService } from '../../services/pin.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { BlandPageService } from '../../services/bland-page.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { GoogleMapService } from '../../services/google-map.service';
import { UserLocationService } from  '../../services/user-location.service';
import { GeoCoordinates } from '../../models/geo-coordinates';
import { Pin } from '../../models/pin';
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
        mockSessionService = jasmine.createSpyObj<SessionService>('session', ['getContactId']);
        mockPinService = jasmine.createSpyObj<PinService>('pinService', ['requestToJoinGathering']);
        mockLoginRedirectService = jasmine.createSpyObj<LoginRedirectService>('loginRedirectService', ['redirectToLogin']);
        mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['primeAndGo', 'goToDefaultError']);
        mockStateService = jasmine.createSpyObj<StateService>(
            'state', ['setLoading', 'setPageHeader', 'setCurrentView', 'setMyViewOrWorldView']);
        mockMapHelperService = jasmine.createSpyObj<GoogleMapService>('mapHlpr', ['setLoading', 'setPageHeader']);
        mockNeighborsHelperService = jasmine.createSpyObj<NeighborsHelperService>('neighborsHelper', ['setLoading', 'setPageHeader']);
        mockUserLocationService = jasmine.createSpyObj<UserLocationService>('userLocationService', ['setLoading', 'setPageHeader']);

        TestBed.configureTestingModule({
            declarations: [
                MapFooterComponent
            ],
            imports: [],
            providers: [
                { provide: PinService, useValue: mockPinService },
                { provide: SessionService, useValue: mockSessionService },
                { provide: LoginRedirectService, useValue: mockLoginRedirectService },
                { provide: BlandPageService, useValue: mockBlandPageService },
                { provide: StateService, useValue: mockStateService },
                { provide: GoogleMapService, useValue: mockMapHelperService },
                { provide: NeighborsHelperService, useValue: mockNeighborsHelperService },
                { provide: UserLocationService, useValue: mockUserLocationService },
                {
                    provide: Router,
                    useValue: { routerState: { snapshot: { url: 'abc123' } } },
                },
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

  xit('should emit new search results event', (done) => {
    this.comp.pin.searchResultsEmitter.subscribe( g => {
      // pass into the toEqual() results of the mock below - PinSearchResultsDto object
      // expect(g).toEqual();
      // done();
    });
    // mock out results to be found and emmitted here
    this.comp.myStuffBtnClicked();
  });

  xit('should get my stuff and init map', () => {
    this.fixture.pinSearchResults = new PinSearchResultsDto(new GeoCoordinates(0, 0), new Array<Pin>());
    this.comp.myStuffBtnClicked();
    expect(this.comp.pinSearchResults).toBeTruthy();
  });

});
