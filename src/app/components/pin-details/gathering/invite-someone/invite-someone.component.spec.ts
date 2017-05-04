/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { ToastsManager } from 'ng2-toastr';
import { RouterTestingModule } from '@angular/router/testing';

import { InviteSomeoneComponent } from './invite-someone.component';

import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { PinService } from '../../../../services/pin.service';
import { BlandPageService } from '../../../../services/bland-page.service';
import { StateService } from '../../../../services/state.service';

import { Person } from '../../../../models/person';
import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../../../models/bland-page-details';

describe('InviteSomeoneComponent', () => {
    let fixture: ComponentFixture<InviteSomeoneComponent>;
    let comp: InviteSomeoneComponent;
    let el;

    let mockContentService, mockFormBuilder, mockRouter, mockPinService, mockBlandPageService, mockStateService, mockToast;
    beforeEach(() => {
        mockPinService = { inviteToGathering: jest.fn() };
        mockBlandPageService = { primeAndGo: jest.fn() };
        mockStateService = { setLoading: jest.fn() };
        mockToast = { error: jest.fn() };
        mockContentService = { getContent: jest.fn() };

        TestBed.configureTestingModule({
            declarations: [
                InviteSomeoneComponent
            ],
            imports: [
                RouterTestingModule.withRoutes([]),
            ],
            providers: [
                FormBuilder,
                { provide: PinService, useValue: mockPinService },
                { provide: BlandPageService, useValue: mockBlandPageService },
                { provide: StateService, useValue: mockStateService },
                { provide: ToastsManager, useValue: mockToast },
                { provide: ContentService, useValue: mockContentService }
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
            '<h1 class="title">Invitation Sent</h1>' +
            // tslint:disable-next-line:max-line-length
            `<p>${someone.firstname.slice(0, 1).toUpperCase()}${someone.firstname.slice(1).toLowerCase()} ${someone.lastname.slice(0, 1).toUpperCase()}. has been notified.</p>`,
            BlandPageType.Text,
            BlandPageCause.Success,
            `gathering/${gatheringId}`
        );
        mockPinService.inviteToGathering.mockReturnValue(Observable.of({}));
        comp.gatheringId = gatheringId;
        comp.participantId = participantId;

        comp.onSubmit(param);

        expect(mockStateService.setLoading).toHaveBeenCalledWith(true);
        expect(mockPinService.inviteToGathering).toHaveBeenCalledWith(gatheringId, someone);
        expect(mockBlandPageService.primeAndGo).toHaveBeenCalledWith(blandPageDetails);
    });

    it('should fail to submit', () => {
        let expectedText = '<p>invite failed</p>';
        let someone = new Person('TestFirstname', 'TestLastname', 'person@email.com');
        let isValid = true;
        let gatheringId = 123;
        let participantId = 456;
        let param = { value: someone, valid: isValid };
        mockContentService.getContent.mockReturnValue(expectedText);
        mockPinService.inviteToGathering.mockReturnValue(Observable.throw({}));
        comp.gatheringId = gatheringId;
        comp.participantId = participantId;

        comp.onSubmit(param);

        expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
        expect(mockPinService.inviteToGathering).toHaveBeenCalledWith(gatheringId, someone);
        expect(mockToast.error).toHaveBeenCalledWith(expectedText);
    });

});
