/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockTestData } from '../../../shared/MockTestData';
import { Observable } from 'rxjs/Rx';

import { GatheringComponent } from './gathering.component';

import { Pin } from '../../../models/pin';
import { Address } from '../../../models/address';
import { Group } from '../../../models/group';
import { Participant } from '../../../models/participant';

import { APIService } from '../../../services/api.service';
import { ContentService } from '../../../services/content.service';
import { SessionService } from '../../../services/session.service';
import { PinService } from '../../../services/pin.service';
import { LoginRedirectService } from '../../../services/login-redirect.service';
import { BlandPageService } from '../../../services/bland-page.service';
import { StateService } from '../../../services/state.service';

describe('GatheringComponent', () => {
    let fixture: ComponentFixture<GatheringComponent>;
    let comp: GatheringComponent;
    let el;
    let mockAPIService;
    let mockContentService;
    let mockSessionService;
    let mockPinService;
    let mockLoginRedirectService;
    let mockBlandPageService;
    let mockStateService;


    beforeEach(() => {
        mockAPIService = jasmine.createSpyObj<APIService>('api', ['getContactId']);
        mockContentService = jasmine.createSpyObj<ContentService>('content', ['']);
        mockSessionService = jasmine.createSpyObj<SessionService>('session', ['getContactId']);
        mockPinService = jasmine.createSpyObj<PinService>('pinService', ['requestToJoinGathering']);
        mockLoginRedirectService = jasmine.createSpyObj<LoginRedirectService>('loginRedirectService', ['redirectToLogin']);
        mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['setBlandPageDetailsAndGo']);
        mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading']);

        TestBed.configureTestingModule({
            declarations: [
                GatheringComponent
            ],
            imports: [],
            providers: [
                { provide: APIService, useValue: mockAPIService },
                { provide: PinService, useValue: mockPinService },
                { provide: ContentService, useValue: mockContentService },
                { provide: SessionService, useValue: mockSessionService },
                { provide: LoginRedirectService, useValue: mockLoginRedirectService },
                { provide: BlandPageService, useValue: mockBlandPageService },
                { provide: StateService, useValue: mockStateService },
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
            fixture = TestBed.createComponent(GatheringComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('should create an instance', () => {
        expect(comp).toBeTruthy();
    });

    it('should init and loggedInUser is in gathering', () => {
        let pin = MockTestData.getAPin(1);
        (<jasmine.Spy>mockSessionService.getContactId).and.returnValue(pin.gathering.Participants[2].contactId);
        comp.isLoggedIn = true;
        comp.pin = pin;
        comp.ngOnInit();
        expect(comp.isInGathering).toBe(true);
    });

    it('should init and loggedInUser is NOT in gathering', () => {
        let pin = MockTestData.getAPin(1);
        (<jasmine.Spy>mockSessionService.getContactId).and.returnValue(8675309);
        comp.isLoggedIn = true;
        comp.pin = pin;
        comp.ngOnInit();
        expect(comp.isInGathering).toBe(false);
    });

    it('should redirectToLogin while request(ing)ToJoin', () => {
        comp.isLoggedIn = false;
        comp.requestToJoin();
        expect(<jasmine.Spy>mockLoginRedirectService.redirectToLogin).toHaveBeenCalledWith('abc123');
    })

    it('should succeed while requesting to join', () => {
        comp.isLoggedIn = true;
        let pin = MockTestData.getAPin(1);
        (<jasmine.Spy>mockPinService.requestToJoinGathering).and.returnValue(Observable.of([{}]));
        comp.pin = pin;


        comp.requestToJoin();
        expect(<jasmine.Spy>mockLoginRedirectService.redirectToLogin).not.toHaveBeenCalled();
        expect(<jasmine.Spy>mockPinService.requestToJoinGathering).toHaveBeenCalledWith(pin.gathering.groupId);
    })
});
