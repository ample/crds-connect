/* tslint:disable:no-unused-variable */
import { Angulartics2 } from 'angulartics2';
import { NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { MapFooterComponent } from './map-footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NeighborsHelperService } from '../../services/neighbors-helper.service';
import { PinService } from '../../services/pin.service';
import { SearchService } from '../../services/search.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { BlandPageService } from '../../services/bland-page.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { UserLocationService } from  '../../services/user-location.service';



describe('Component: MapFooter', () => {
    let fixture: ComponentFixture<MapFooterComponent>;
    let comp: MapFooterComponent;
    let mockPinService;
    let mockLoginRedirectService;
    let mockNeighborsHelperService;
    let mockRouter;
    let mockStateService;
    let mockSessionService;
    let mockBlandPageService;
    let mockUserLocationService;
    let mockAngulartics2;
    let mockSearchService;

    beforeEach(() => {
        mockPinService = { getPinSearchResults: jest.fn() };
        mockLoginRedirectService = { redirectToLogin: jest.fn() };
        mockStateService = { setLoading: jest.fn(), setPageHeader: jest.fn(), setCurrentView: jest.fn(),
                             setMyViewOrWorldView: jest.fn(), getCurrentView: jest.fn() };
        mockSessionService = { getContactId: jest.fn(), isLoggedIn: jest.fn() };
        mockBlandPageService = { primeAndGo: jest.fn(), goToDefaultError: jest.fn() };
        mockUserLocationService = { getUserLocation: jest.fn() };
        mockAngulartics2 = { eventTrack: { next:  jest.fn() } };
        mockSearchService = { emitMyStuffSearch: jest.fn(), };

        TestBed.configureTestingModule({
            declarations: [
                MapFooterComponent
            ],
            providers: [
                { provide: PinService, useValue: mockPinService },
                { provide: LoginRedirectService, useValue: mockLoginRedirectService },
                { provide: StateService, useValue: mockStateService },
                { provide: SessionService, useValue: mockSessionService },
                { provide: BlandPageService, useValue: mockBlandPageService },
                { provide: UserLocationService, useValue: mockUserLocationService },
                { provide: Angulartics2, useValue: mockAngulartics2 },
                { provide: SearchService, useValue: mockSearchService }
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

});
