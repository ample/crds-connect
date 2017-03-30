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
import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../../models/bland-page-details';

import { SessionService } from '../../../services/session.service';
import { PinService } from '../../../services/pin.service';
import { LoginRedirectService } from '../../../services/login-redirect.service';
import { BlandPageService } from '../../../services/bland-page.service';
import { StateService } from '../../../services/state.service';
import { ParticipantService } from '../../../services/participant.service';
import { ToastsManager, Toast } from 'ng2-toastr';

describe('GatheringComponent', () => {
    let fixture: ComponentFixture<GatheringComponent>;
    let comp: GatheringComponent;
    let el;
    let mockSessionService;
    let mockPinService;
    let mockLoginRedirectService;
    let mockBlandPageService;
    let mockStateService;
    let mockParticipantService;
    let mockToast;


    beforeEach(() => {
        mockSessionService = jasmine.createSpyObj<SessionService>('session', ['getContactId']);
        mockPinService = jasmine.createSpyObj<PinService>('pinService', ['requestToJoinGathering']);
        mockLoginRedirectService = jasmine.createSpyObj<LoginRedirectService>('loginRedirectService', ['redirectToLogin']);
        mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['primeAndGo', 'goToDefaultError']);
        mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading']);
        mockParticipantService = jasmine.createSpyObj<ParticipantService>('participantService', ['getParticipants']);
        mockToast = jasmine.createSpyObj<ToastsManager>('toast', ['warning', 'error']);


        TestBed.configureTestingModule({
            declarations: [
                GatheringComponent
            ],
            imports: [],
            providers: [
                { provide: PinService, useValue: mockPinService },
                { provide: SessionService, useValue: mockSessionService },
                { provide: LoginRedirectService, useValue: mockLoginRedirectService },
                { provide: BlandPageService, useValue: mockBlandPageService },
                { provide: StateService, useValue: mockStateService },
                { provide: ParticipantService, useValue: mockParticipantService },
                { provide: ToastsManager, useValue: mockToast },
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

    it('should init, get participants and loggedInUser is in gathering', () => {
        let pin = MockTestData.getAPin(1);
        let participants = MockTestData.getAParticipantsArray(3);
        (<jasmine.Spy>mockSessionService.getContactId).and.returnValue(participants[2].contactId);
        (<jasmine.Spy>mockParticipantService.getParticipants).and.returnValue(Observable.of(participants));
        comp.isLoggedIn = true;
        comp.pin = pin;
        comp.ngOnInit();
        expect(comp.isInGathering).toBe(true);
        expect(mockParticipantService.getParticipants).toHaveBeenCalledWith(pin.gathering.groupId);
        expect(mockSessionService.getContactId).toHaveBeenCalled();
    });

    it('should init, get participants and loggedInUser is NOT in gathering', () => {
        let pin = MockTestData.getAPin(1);
        let participants = MockTestData.getAParticipantsArray(3);
        (<jasmine.Spy>mockSessionService.getContactId).and.returnValue(8675309);
        (<jasmine.Spy>mockParticipantService.getParticipants).and.returnValue(Observable.of(participants));
        comp.isLoggedIn = true;
        comp.pin = pin;
        comp.ngOnInit();
        expect(comp.isInGathering).toBe(false);
        expect(mockParticipantService.getParticipants).toHaveBeenCalledWith(pin.gathering.groupId);
        expect(mockSessionService.getContactId).toHaveBeenCalled();
    });

    it('should init and fail to get participants', () => {
        let pin = MockTestData.getAPin(1);
        (<jasmine.Spy>mockSessionService.getContactId).and.returnValue(8675309);
        (<jasmine.Spy>mockParticipantService.getParticipants).and.returnValue(Observable.throw({status: 500}));
        comp.isLoggedIn = true;
        comp.pin = pin;
        comp.ngOnInit();
        expect(mockParticipantService.getParticipants).toHaveBeenCalledWith(pin.gathering.groupId);
        expect(mockSessionService.getContactId).not.toHaveBeenCalled();
        expect(<jasmine.Spy>mockBlandPageService.goToDefaultError).toHaveBeenCalledWith('');
    });

    it('should redirectToLogin while request(ing)ToJoin', () => {
        comp.isLoggedIn = false;
        comp.requestToJoin();
        expect(<jasmine.Spy>mockLoginRedirectService.redirectToLogin).toHaveBeenCalledWith('abc123');
    });

    it('should succeed while requesting to join', () => {
        comp.isLoggedIn = true;
        let pin = MockTestData.getAPin(1);
        let expectedBPD = new BlandPageDetails(
            'Return to map',
            'gatheringJoinRequestSent',
            BlandPageType.ContentBlock,
            BlandPageCause.Success,
            ''
        );
        (<jasmine.Spy>mockPinService.requestToJoinGathering).and.returnValue(Observable.of([{}]));
        comp.pin = pin;


        comp.requestToJoin();
        expect(<jasmine.Spy>mockLoginRedirectService.redirectToLogin).not.toHaveBeenCalled();
        expect(<jasmine.Spy>mockPinService.requestToJoinGathering).toHaveBeenCalledWith(pin.gathering.groupId);
        expect(<jasmine.Spy>mockBlandPageService.primeAndGo).toHaveBeenCalledWith(expectedBPD);
    });

    it('should fail with 409 (conflict) while requesting to join', () => {
        comp.isLoggedIn = true;
        let pin = MockTestData.getAPin(1);
        let expectedBPD = new BlandPageDetails(
            'Back',
            '<h1 class="h1 text-center">OOPS</h1><p class="text text-center">Looks like you have already requested to join this group.</p>',
            BlandPageType.Text,
            BlandPageCause.Error,
            'gathering/' + pin.gathering.groupId,
        );
        (mockPinService.requestToJoinGathering).and.returnValue(Observable.throw({ status: 409 }));
        comp.pin = pin;

        comp.requestToJoin();
        expect(mockLoginRedirectService.redirectToLogin).not.toHaveBeenCalled();
        expect(mockPinService.requestToJoinGathering).toHaveBeenCalledWith(pin.gathering.groupId);
        expect(mockToast.warning).toHaveBeenCalledWith('Looks like you have already requested to join this group', 'OOPS');
    });

    it('should fail with error while requesting to join', () => {
        comp.isLoggedIn = true;
        let pin = MockTestData.getAPin(1);
        (<jasmine.Spy>mockPinService.requestToJoinGathering).and.returnValue(Observable.throw({ status: 500 }));
        comp.pin = pin;

        comp.requestToJoin();
        expect(<jasmine.Spy>mockLoginRedirectService.redirectToLogin).not.toHaveBeenCalled();
        expect(<jasmine.Spy>mockPinService.requestToJoinGathering).toHaveBeenCalledWith(pin.gathering.groupId);
        expect(<jasmine.Spy>mockBlandPageService.primeAndGo).not.toHaveBeenCalled();
        expect(mockToast.error).toHaveBeenCalledWith('Looks like there was an error. Please fix and try again', 'Oh no!');
    });
});
