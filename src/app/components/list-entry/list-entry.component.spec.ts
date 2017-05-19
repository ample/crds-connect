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
import { MockComponent } from '../../shared/mock.component';
import { MockBackend } from '@angular/http/testing';

describe('ListEntryComponent', () => {
    let mockStateService, mockSessionService;
    let fixture: ComponentFixture<ListEntryComponent>;
    let comp: ListEntryComponent;
    let router: Router;
    let el;

    beforeEach(() => {
        class RouterStub {
            navigate(url: string) { return url; }
        }

        mockStateService = jasmine.createSpyObj<StateService>('stateService', ['constructor']);
        mockSessionService = jasmine.createSpyObj<SessionService>('sessionService', ['constructor', 'getContactId']);


        TestBed.configureTestingModule({
            declarations: [
                ListEntryComponent,
                MockComponent({selector: 'profile-picture', inputs: ['contactId', 'wrapperClass', 'imageClass']}),
                MockComponent({selector: 'readonly-address', inputs: ['isPinOwner', 'address', 'distance']})
            ],
            providers: [
                { provide: StateService, useValue: mockStateService },
                { provide: SessionService, useValue: mockSessionService },
                { provide: Router, useClass: RouterStub }
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
});
