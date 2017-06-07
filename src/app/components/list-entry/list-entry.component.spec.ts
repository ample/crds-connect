import { AppSettingsService } from '../../services/app-settings.service';
import { pinType } from '../../models';
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
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { ListHelperService } from '../../services/list-helper.service';
import { MockComponent } from '../../shared/mock.component';
import { MockBackend } from '@angular/http/testing';

describe('ListEntryComponent', () => {
    let mockStateService, mockSessionService, mockListHelperService, mockAppSettings, mockRouter;
    let fixture: ComponentFixture<ListEntryComponent>;
    let comp: ListEntryComponent;
    let router: Router;
    let el;

    beforeEach(() => {
        mockStateService = jasmine.createSpyObj<StateService>('stateService', ['setCurrentView']);
        mockListHelperService = jasmine.createSpyObj<ListHelperService>('listHelper', ['truncateTextEllipsis']);
        mockSessionService = jasmine.createSpyObj<SessionService>('sessionService', ['getContactId']);
        mockAppSettings = jasmine.createSpyObj<AppSettingsService>('appSettings', ['isConnectApp']);
        mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);


        TestBed.configureTestingModule({
            declarations: [
                ListEntryComponent,
                MockComponent({selector: 'profile-picture', inputs: ['contactId', 'wrapperClass', 'imageClass']}),
                MockComponent({selector: 'readonly-address', inputs: ['isPinOwner', 'address', 'distance']})
            ],
            providers: [
                { provide: StateService, useValue: mockStateService },
                { provide: SessionService, useValue: mockSessionService },
                { provide: ListHelperService, useValue: mockListHelperService },
                { provide: Router, useValue: mockRouter },
                { provide: AppSettingsService, useValue: mockAppSettings }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ListEntryComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('should create an instance', () => {
        expect(comp).toBeTruthy();
    });

    it('should return proper name format', () => {
        fixture.detectChanges();
        comp.firstName = 'Bob';
        comp.lastName = 'Johnson';
        expect(comp.formatName()).toBe('BOB J.');
    });

    it('should return proper count string', () => {
        fixture.detectChanges();
        comp.participantCount = 10;
        expect(comp.count()).toBe('10 OTHERS');
    });

    it('should call isMyGathering and return true', () => {
        fixture.detectChanges();
        comp.contactId = 1;
        comp.currentContactId = 1;
        comp.type = pinType.GATHERING;
        expect(comp.isMyGathering()).toBe(true);
    });

    it('should call isMyGathering and return false', () => {
        fixture.detectChanges();
        comp.contactId = 1;
        comp.currentContactId = 2;
        comp.type = pinType.GATHERING;
        expect(comp.isMyGathering()).toBe(false);
    });

    it('should redirect to groups in group mode', () => {
        (mockAppSettings.isConnectApp).and.returnValue(false);
        comp.displayDetails(1);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['small-group/1']);
    });

    it('should redirect to gathering in connect mode', () => {
        (mockAppSettings.isConnectApp).and.returnValue(true);
        comp.displayDetails(1);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['gathering/1/']);
    });
});
