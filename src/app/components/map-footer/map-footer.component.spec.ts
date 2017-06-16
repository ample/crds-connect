import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Angulartics2 } from 'angulartics2/dist';

import { AppSettingsService } from '../../services/app-settings.service';
import { BlandPageService } from '../../services/bland-page.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { PinService } from '../../services/pin.service';
import { SearchService } from '../../services/search.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { UserLocationService } from '../../services/user-location.service';
import { MapFooterComponent } from './map-footer.component';
import { PinSearchRequestParams } from '../../models/pin-search-request-params';

describe('MapFooterComponent', () => {
    class Angulartics2Stub {
        eventTrack = {
            next: jasmine.createSpy('next')
        };
    };

    class StateStub {
        setCurrentView = jasmine.createSpy('setCurrentView');
        setLoading = jasmine.createSpy('setLoading');
        setMyViewOrWorldView = jasmine.createSpy('setMyViewOrWorldView');
        setIsMyStuffActive = jasmine.createSpy('setIsMyStuffActive');
        lastSearch = { search: null };
        myStuffActive = false;
    }
    let fixture: ComponentFixture<MapFooterComponent>;
    let comp: MapFooterComponent;
    let el;
    let mockAppSettings, mockPinService, mockLoginRedirectService,
        mockRouter, mockState, mockSession, mockBlandPageService, mockUserLocationService,
        mockSearchService, mockAngulartics2;

    beforeEach(() => {
        mockAppSettings = jasmine.createSpyObj<AppSettingsService>('appSettings', ['isConnectApp']);
        mockPinService = jasmine.createSpyObj<PinService>('pinService', ['emitPinSearchRequest', 'clearPinCache']);
        mockLoginRedirectService = jasmine.createSpyObj<LoginRedirectService>('loginRedirectService',
            ['redirectToTarget', 'redirectToLogin']);
        mockState = new StateStub();
        mockSession = jasmine.createSpyObj<SessionService>('session', ['isLoggedIn']);
        mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['goToGettingStarted']);
        mockAngulartics2 = new Angulartics2Stub();

        TestBed.configureTestingModule({
            declarations: [
                MapFooterComponent
            ],
            providers: [
                { provide: AppSettingsService, useValue: mockAppSettings },
                { provide: PinService, useValue: mockPinService },
                { provide: LoginRedirectService, useValue: mockLoginRedirectService },
                {
                    provide: Router,
                    useValue: { routerState: { snapshot: { url: '/map-footer-component' } } },
                },
                { provide: StateService, useValue: mockState },
                { provide: SessionService, useValue: mockSession },
                { provide: BlandPageService, useValue: mockBlandPageService },
                { provide: UserLocationService, useValue: mockUserLocationService },
                { provide: SearchService, useValue: mockSearchService },
                { provide: Angulartics2, useValue: mockAngulartics2 }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(MapFooterComponent);
            comp = fixture.componentInstance;

            // el = fixture.debugElement.query(By.css('h1'));
        });
    }));

    it('should create an instance', () => {
        comp.ngOnInit();
        expect(comp).toBeTruthy();
    });

    it('myStuffBtnClicked when not in my stuff mode (Logged in)', () => {
        mockState.myStuffActive = false;
        (mockSession.isLoggedIn).and.returnValue(true);
        comp.myStuffBtnClicked();
        expect(mockAngulartics2.eventTrack.next).toHaveBeenCalledWith({ action: 'myStuff Button Click',
               properties: { category: 'Connect' }});
        expect(mockPinService.clearPinCache).toHaveBeenCalledTimes(1);
        expect(mockState.setLoading).toHaveBeenCalledTimes(1);
        expect(mockState.setCurrentView).toHaveBeenCalledWith('map');
        expect(mockState.setMyViewOrWorldView).toHaveBeenCalledWith('my');
        expect(mockState.setIsMyStuffActive).toHaveBeenCalledWith(true);
        expect(mockPinService.emitPinSearchRequest).toHaveBeenCalledWith(new PinSearchRequestParams(true, null));
    });

    it('myStuffBtnClicked should redirect to login when not logged in', () => {
        mockState.myStuffActive = false;
        (mockSession.isLoggedIn).and.returnValue(false);
        comp.myStuffBtnClicked();
        expect(mockAngulartics2.eventTrack.next).toHaveBeenCalledWith({ action: 'myStuff Button Click',
               properties: { category: 'Connect' }});
        expect(mockPinService.clearPinCache).toHaveBeenCalledTimes(1);
        expect(mockLoginRedirectService.redirectToLogin).toHaveBeenCalledWith('/map-footer-component', comp.redirectThenChangeToMyStuff);
    });

    it('mystuffBtnClicked when my stuff mode is active', () => {
        mockState.lastSearch.search = 'yay stuff';
        mockState.myStuffActive = true;

        comp.myStuffBtnClicked();

        expect(mockAngulartics2.eventTrack.next).toHaveBeenCalledWith({ action: 'myStuff Button Click',
               properties: { category: 'Connect' }});
        expect(mockState.setIsMyStuffActive).toHaveBeenCalledWith(false);
        expect(mockState.lastSearch.search).toBe('');
        expect(mockState.setLoading).toHaveBeenCalledWith(true);
        expect(mockState.setCurrentView).toHaveBeenCalledWith('map');
        expect(mockState.setMyViewOrWorldView).toHaveBeenCalledWith('world');
        expect(mockPinService.emitPinSearchRequest).toHaveBeenCalledWith(new PinSearchRequestParams(true, null));
    });

    it('redirectThenChangeToMyStuff should do change to mystuff and redirect to target', () => {
        spyOn(comp, 'changeStateToMyStuff');
        comp.redirectThenChangeToMyStuff();

        expect(comp.changeStateToMyStuff).toHaveBeenCalledTimes(1);
        expect(mockLoginRedirectService.redirectToTarget).toHaveBeenCalledTimes(1);
    });

    it('should set state and go to getting started when gettingStartedBtnClicked', () =>{
        comp.gettingStartedBtnClicked();
        expect(mockState.setCurrentView).toHaveBeenCalledWith('map');
        expect(mockBlandPageService.goToGettingStarted).toHaveBeenCalledTimes(1);
    });
});
