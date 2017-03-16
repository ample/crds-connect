/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { InviteSomeoneComponent } from './invite-someone.component';

import { ContentService } from '../../../../services/content.service';
import { PinService } from '../../../../services/pin.service';
import { BlandPageService } from '../../../../services/bland-page.service'

import { Person } from '../../../../models/Person';
import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../../../models/bland-page-details'

describe('InviteSomeoneComponent', () => {
    let fixture: ComponentFixture<InviteSomeoneComponent>;
    let comp: InviteSomeoneComponent;
    let el;

    let mockFormBuilder, mockRouter, mockContentService, mockPinService, mockBlandPageService;

    beforeEach(() => {
        mockFormBuilder = jasmine.createSpyObj<FormBuilder>('fb', ['']);
        mockRouter = jasmine.createSpyObj<Router>('router', ['']);
        mockContentService = jasmine.createSpyObj<ContentService>('content', ['']);
        mockPinService = jasmine.createSpyObj<PinService>('pinService', ['inviteToGathering']);
        mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['setBlandPageDetailsAndGo']);


        TestBed.configureTestingModule({
            declarations: [
                InviteSomeoneComponent
            ],
            providers: [
                { provide: Router, useValue: mockRouter },
                { provide: FormBuilder, useValue: mockFormBuilder },
                { provide: ContentService, useValue: mockContentService },
                { provide: PinService, useValue: mockPinService },
                { provide: BlandPageService, useValue: mockBlandPageService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(InviteSomeoneComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('component should exist', () => {
        expect(comp).toBeTruthy();
    });

    it('should init form with formGroup', () => {
        comp.ngOnInit();
        expect(comp.inviteFormGroup).toBeTruthy();
        expect(comp.inviteFormGroup.controls['firstname']).toBeTruthy();
        expect(comp.inviteFormGroup.controls['lastname']).toBeTruthy();
        expect(comp.inviteFormGroup.controls['email']).toBeTruthy();
    });

    it('should successfully submit', () => {
        let someone = new Person('TestFirstname', 'TestLastname', 'person@email.com');
        let isValid = true;
        let gatheringId = 123;
        let participantId = 456;
        let param = { value: someone, valid: isValid };
        let blandPageDetails = new BlandPageDetails(
            'Return to my pin',
            '<h1 class="h1 text-center">Invite sent</h1>' +
            `<p class="text text-center">${someone.firstname.slice(0, 1).toUpperCase()}${someone.firstname.slice(1).toLowerCase()} ${someone.lastname.slice(0, 1).toUpperCase()}. has been notified.</p>`,
            `pin-details/${participantId}`,
            BlandPageType.Text,
            BlandPageCause.Success
        );
        (<jasmine.Spy>mockPinService.inviteToGathering).and.returnValue(Observable.of({}));
        comp.gatheringId = gatheringId;
        comp.participantId = participantId;

        comp.onSubmit(param);

        expect(<jasmine.Spy>mockPinService.inviteToGathering).toHaveBeenCalledWith(gatheringId, someone);
        expect(<jasmine.Spy>mockBlandPageService.setBlandPageDetailsAndGo).toHaveBeenCalledWith(blandPageDetails);
    });

    it('should fail to submit', () => {
        let someone = new Person('TestFirstname', 'TestLastname', 'person@email.com');
        let isValid = true;
        let gatheringId = 123;
        let participantId = 456;
        let param = { value: someone, valid: isValid };

        (<jasmine.Spy>mockPinService.inviteToGathering).and.returnValue(Observable.of({}));
        comp.gatheringId = gatheringId;
        comp.participantId = participantId;

        comp.onSubmit(param);

        expect(<jasmine.Spy>mockPinService.inviteToGathering).toHaveBeenCalledWith(gatheringId, someone);
    });

});
