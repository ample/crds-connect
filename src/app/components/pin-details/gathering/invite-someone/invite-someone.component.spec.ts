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

import { InviteSomeoneComponent } from './invite-someone.component';

import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { PinService } from '../../../../services/pin.service';
import { BlandPageService } from '../../../../services/bland-page.service';
import { StateService } from '../../../../services/state.service';
import { AppSettingsService } from '../../../../services/app-settings.service';

import { Person } from '../../../../models/person';
import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../../../models/bland-page-details';

describe('InviteSomeoneComponent', () => {
    let fixture: ComponentFixture<InviteSomeoneComponent>;
    let comp: InviteSomeoneComponent;
    let el;

    let mockContentService, mockFormBuilder, mockRouter, mockPinService, mockBlandPageService, mockStateService, mockToast, mockAppSettings;

    beforeEach(() => {
        mockFormBuilder = jasmine.createSpyObj<FormBuilder>('fb', ['']);
        mockRouter = jasmine.createSpyObj<Router>('router', ['']);
        mockPinService = jasmine.createSpyObj<PinService>('pinService', ['inviteToGroup']);
        mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['primeAndGo']);
        mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading']);
        mockToast = jasmine.createSpyObj<ToastsManager>('toast', ['error']);
        mockContentService = jasmine.createSpyObj<ContentService>('content', ['getContent']);
        mockAppSettings = jasmine.createSpyObj<AppSettingsService>('appSettings', ['']);

        TestBed.configureTestingModule({
            declarations: [
                InviteSomeoneComponent
            ],
            providers: [
                { provide: Router, useValue: mockRouter },
                { provide: FormBuilder, useValue: mockFormBuilder },
                { provide: PinService, useValue: mockPinService },
                { provide: BlandPageService, useValue: mockBlandPageService },
                { provide: StateService, useValue: mockStateService },
                { provide: ToastsManager, useValue: mockToast },
                { provide: ContentService, useValue: mockContentService },
                { provide: AppSettingsService, useValue: mockAppSettings }
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

    fit('should successfully submit', () => {
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

        mockAppSettings.finderType = 'CONNECT';

        (<jasmine.Spy>mockPinService.inviteToGroup).and.returnValue(Observable.of({}));
        comp.gatheringId = gatheringId;
        comp.participantId = participantId;

        comp.onSubmit(param);

        expect(<jasmine.Spy>mockStateService.setLoading).toHaveBeenCalledWith(true);
        expect(<jasmine.Spy>mockPinService.inviteToGroup).toHaveBeenCalledWith(gatheringId, someone, 'CONNECT');
        expect(<jasmine.Spy>mockBlandPageService.primeAndGo).toHaveBeenCalledWith(blandPageDetails);
    });

    fit('should fail to submit', () => {
        let expectedText = '<p>invite failed</p>';
        let someone = new Person('TestFirstname', 'TestLastname', 'person@email.com');
        let isValid = true;
        let gatheringId = 123;
        let participantId = 456;
        let param = { value: someone, valid: isValid };

        mockContentService.getContent.and.returnValue(expectedText);
        mockAppSettings.finderType = 'CONNECT';

        (<jasmine.Spy>mockPinService.inviteToGroup).and.returnValue(Observable.throw({}));
        comp.gatheringId = gatheringId;
        comp.participantId = participantId;

        comp.onSubmit(param);

        expect(<jasmine.Spy>mockStateService.setLoading).toHaveBeenCalledWith(false);
        expect(<jasmine.Spy>mockPinService.inviteToGroup).toHaveBeenCalledWith(gatheringId, someone, 'CONNECT');
        expect(mockToast.error).toHaveBeenCalledWith(expectedText);
    });

});
