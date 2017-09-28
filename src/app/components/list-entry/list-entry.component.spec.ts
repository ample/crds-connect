import { Pin, pinType } from '../../models';
/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { ListEntryComponent } from './list-entry.component';
import { Observable } from 'rxjs/Rx';
import { AppSettingsService } from '../../services/app-settings.service';
import { ListHelperService } from '../../services/list-helper.service';
import { PinService } from '../../services/pin.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { ParticipantService } from '../../services/participant.service';
import { MockComponent } from '../../shared/mock.component';
import { MockBackend } from '@angular/http/testing';
import { Participant } from '../../models/participant';
import { MockTestData } from '../../shared/MockTestData';

describe('ListEntryComponent', () => {
    let mockAppSettings, mockPinService, mockStateService, mockSessionService, mockListHelperService,
        mockRouter, mockParticipantService;
    let fixture: ComponentFixture<ListEntryComponent>;
    let comp: ListEntryComponent;
    let router: Router;
    let el;

    beforeEach(() => {
        mockPinService = jasmine.createSpyObj<StateService>('pinService', ['navigateToPinDetailsPage']);
        mockStateService = jasmine.createSpyObj<StateService>('stateService', ['setCurrentView']);
        mockListHelperService = jasmine.createSpyObj<ListHelperService>('listHelper', ['truncateTextEllipsis']);
        mockSessionService = jasmine.createSpyObj<SessionService>('sessionService', ['getContactId']);
        mockAppSettings = jasmine.createSpyObj<AppSettingsService>('appSettings', ['isConnectApp']);
        mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
        mockParticipantService = jasmine.createSpyObj<Router>('participantService', ['getAllLeaders']);


        TestBed.configureTestingModule({
            declarations: [
                ListEntryComponent,
                MockComponent({selector: 'profile-picture', inputs: ['contactId', 'wrapperClass', 'imageClass']}),
                MockComponent({selector: 'readonly-address', inputs: ['isPinOwner', 'address', 'distance']})
            ],
            providers: [
                { provide: PinService, useValue: mockPinService },
                { provide: StateService, useValue: mockStateService },
                { provide: SessionService, useValue: mockSessionService },
                { provide: ListHelperService, useValue: mockListHelperService },
                { provide: Router, useValue: mockRouter },
                { provide: AppSettingsService, useValue: mockAppSettings },
                { provide: ParticipantService, useValue: mockParticipantService }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ListEntryComponent);
            comp = fixture.componentInstance;
            comp.pin = MockTestData.getAPin(1);
        });
    }));

    it('should create an instance', () => {
        expect(comp).toBeTruthy();
    });

    it('should return proper name format', () => {
        let participants = MockTestData.getAParticipantsArray(3);
        (<jasmine.Spy>mockParticipantService.getAllLeaders).and.returnValue(Observable.of(participants));
        fixture.detectChanges();
        comp.type = pinType.GATHERING;
        comp.firstName = 'Bob';
        comp.lastName = 'Johnson';
        expect(comp.formatName()).toBe('BOB J.');
    });

    it('should return proper count string', () => {
        let participants = MockTestData.getAParticipantsArray(3);
        (<jasmine.Spy>mockParticipantService.getAllLeaders).and.returnValue(Observable.of(participants));
        fixture.detectChanges();
        comp.participantCount = 10;
        expect(comp.count()).toBe('10 OTHERS');
    });

    it('should adjust leader names', () => {
        let participants = new Array<Participant>();
        let participant1 = new Participant('congregation', 1, 'displayName', 'email@address.com', 1, 1, 'title', true,
                                           'Smith', 'Jason', 1, new Date(2016, 5).toDateString(), true);
        let participant2 = new Participant('congregation', 1, 'displayName', 'email@address.com', 1, 1, 'title', true,
                                           'Flipe', 'Robert', 1, new Date(2016, 5).toDateString(), true);
        participants.push(participant1);
        participants.push(participant2);
        (<jasmine.Spy>mockParticipantService.getAllLeaders).and.returnValue(Observable.of(participants));
        fixture.detectChanges();
        expect(comp.adjustedLeaderNames).toBe('Jason S., Robert F.');
    });

    it('should redirect to groups in group mode', () => {
        let pin = MockTestData.getAPin(1);
        (mockAppSettings.isConnectApp).and.returnValue(false);
        comp.displayPinDetails(pin);
        expect(mockPinService.navigateToPinDetailsPage).toHaveBeenCalledWith(pin);
    });

    it('should redirect to gathering in connect mode', () => {
        let pin = MockTestData.getAPin(1);
        (mockAppSettings.isConnectApp).and.returnValue(true);
        comp.displayPinDetails(pin);
        expect(mockPinService.navigateToPinDetailsPage).toHaveBeenCalledWith(pin);
    });

    it('should display name properly', () => {
        comp.firstName = 'Bob';
        comp.lastName = 'Jaegermanjenson';
        let leaderName = comp.leaderName();
        expect(leaderName).toBe('Bob J.');
    });

});
