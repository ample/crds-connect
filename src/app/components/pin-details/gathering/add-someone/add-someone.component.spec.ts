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
import { ModalModule } from 'ngx-bootstrap';

import { AddSomeoneComponent } from './add-someone.component';

import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { PinService } from '../../../../services/pin.service';
import { BlandPageService } from '../../../../services/bland-page.service';
import { StateService } from '../../../../services/state.service';
import { AppSettingsService } from '../../../../services/app-settings.service';
import { ParticipantService } from '../../../../services/participant.service';

import { Person } from '../../../../models/person';
import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../../../models/bland-page-details';
import { ModalDirective } from 'ngx-bootstrap/modal';

describe('AddSomeoneComponent', () => {
    let fixture: ComponentFixture<AddSomeoneComponent>;
    let comp: AddSomeoneComponent;
    let el;

    let mockContentService, mockPinService, mockFormBuilder, mockRouter, mockModal;
    let mockBlandPageService, mockStateService, mockToast, mockAppSettings, mockParticipantService;

    beforeEach(() => {
        mockPinService = jasmine.createSpyObj<PinService>('pinService', ['addToGroup', 'getMatch']);
        mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['primeAndGo']);
        mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading']);
        mockToast = jasmine.createSpyObj<ToastsManager>('toast', ['error']);
        mockContentService = jasmine.createSpyObj<ContentService>('content', ['getContent']);

        mockAppSettings =  jasmine.createSpyObj<AppSettingsService>('appSettings', ['setAppSettings', 'isConnectApp']);
        mockAppSettings.finderType = 'CONNECT';

        mockParticipantService = jasmine.createSpyObj<ParticipantService>('participantService', ['clearGroupFromCache']);
        mockFormBuilder = jasmine.createSpyObj<FormBuilder>('fb', ['']);
        mockRouter = jasmine.createSpyObj<Router>('router', ['']);

        mockModal = jasmine.createSpyObj<ModalDirective>('md', ['show']);

        TestBed.configureTestingModule({
            imports: [
                ModalModule.forRoot()
            ],
            declarations: [
                AddSomeoneComponent
            ],
            providers: [
                { provide: PinService, useValue: mockPinService },
                { provide: BlandPageService, useValue: mockBlandPageService },
                { provide: StateService, useValue: mockStateService },
                { provide: ToastsManager, useValue: mockToast },
                { provide: ContentService, useValue: mockContentService },
                { provide: AppSettingsService, useValue: mockAppSettings },
                { provide: ParticipantService, useValue: mockParticipantService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(AddSomeoneComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('AddSomeoneComponent should exist', () => {
        console.log(fixture);
        console.log(comp);
        expect(comp).toBeTruthy();
    });

    it('should init form with formGroup', () => {
        comp.ngOnInit();
        expect(comp.addFormGroup).toBeTruthy();
        expect(comp.addFormGroup.controls['firstname']).toBeTruthy();
        expect(comp.addFormGroup.controls['lastname']).toBeTruthy();
        expect(comp.addFormGroup.controls['email']).toBeTruthy();
    });

    it('should call addToGroup', () => {
        let someone = new Person('TestFirstname', 'TestLastname', 'person@email.com');
        let isValid = true;
        let gatheringId = 123;
        let participantId = 456;
        let param = { value: someone, valid: isValid };
        let blandPageDetails = new BlandPageDetails(
            'Return to my group',
            '<h1 class="title">Your group is growing!</h1>' +
            // tslint:disable-next-line:max-line-length
            `<p>${someone.firstname.slice(0, 1).toUpperCase()}${someone.firstname.slice(1).toLowerCase()} ${someone.lastname.slice(0, 1).toUpperCase()}. has been added to your group.</p>`,
            BlandPageType.Text,
            BlandPageCause.Success,
            `gathering/${gatheringId}`
        );

        (<jasmine.Spy>mockPinService.addToGroup).and.returnValue(Observable.of({}));
        comp.gatheringId = gatheringId;
        comp.participantId = participantId;

        comp.addToGroup(someone);

        expect(<jasmine.Spy>mockPinService.addToGroup).toHaveBeenCalledWith(gatheringId, someone);
        expect(<jasmine.Spy>mockBlandPageService.primeAndGo).toHaveBeenCalledWith(blandPageDetails);
    });

    fit('should successfully submit', () => {
        let someone = new Person('TestFirstname', 'TestLastname', 'person@email.com');
        let isValid = true;
        let gatheringId = 123;
        let participantId = 456;
        let param = { value: someone, valid: isValid };
        
        comp.resultsModal = jasmine.createSpyObj<ModalDirective>('modalDir', ['show', 'hide']);
        (<jasmine.Spy>mockPinService.getMatch).and.returnValue(Observable.of({}));

        comp.gatheringId = gatheringId;
        comp.participantId = participantId;

        comp.onSubmit(param);

        expect(<jasmine.Spy>mockStateService.setLoading).toHaveBeenCalledWith(true);
        expect(<jasmine.Spy>mockPinService.getMatch).toHaveBeenCalledWith(someone);
    });

});
