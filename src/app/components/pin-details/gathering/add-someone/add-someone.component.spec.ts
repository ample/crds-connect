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

import { AddSomeoneComponent } from './add-someone.component';

import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { PinService } from '../../../../services/pin.service';
import { BlandPageService } from '../../../../services/bland-page.service';
import { StateService } from '../../../../services/state.service';
import { AppSettingsService } from '../../../../services/app-settings.service';

import { Person } from '../../../../models/person';
import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../../../models/bland-page-details';

fdescribe('AddSomeoneComponent', () => {
    let fixture: ComponentFixture<AddSomeoneComponent>;
    let comp: AddSomeoneComponent;
    let el;

    let mockContentService, mockFormBuilder, mockRouter, mockPinService, mockBlandPageService, mockStateService, mockToast, mockAppSettings;

    beforeEach(() => {
        mockAppSettings =  jasmine.createSpyObj<AppSettingsService>('app', ['setAppSettings', 'isConnectApp']);
        mockAppSettings.finderType = 'CONNECT';
        mockFormBuilder = jasmine.createSpyObj<FormBuilder>('fb', ['']);
        mockRouter = jasmine.createSpyObj<Router>('router', ['']);
        mockPinService = jasmine.createSpyObj<PinService>('pinService', ['addToGroup']);
        mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['primeAndGo']);
        mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading']);
        mockToast = jasmine.createSpyObj<ToastsManager>('toast', ['error']);
        mockContentService = jasmine.createSpyObj<ContentService>('content', ['getContent']);

        TestBed.configureTestingModule({
            declarations: [
                AddSomeoneComponent
            ],
            providers: [
                { provide: AppSettingsService, useValue: mockAppSettings },
                { provide: Router, useValue: mockRouter },
                { provide: FormBuilder, useValue: mockFormBuilder },
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
            fixture = TestBed.createComponent(AddSomeoneComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('component should exist', () => {
        expect(comp).toBeTruthy();
    });

    it('should init form with formGroup', () => {
        comp.ngOnInit();
        expect(comp.addFormGroup).toBeTruthy();
        expect(comp.addFormGroup.controls['firstname']).toBeTruthy();
        expect(comp.addFormGroup.controls['lastname']).toBeTruthy();
        expect(comp.addFormGroup.controls['email']).toBeTruthy();
    });

    it('should successfully submit', () => {
        let someone = new Person('TestFirstname', 'TestLastname', 'person@email.com');
        let isValid = true;
        let gatheringId = 123;
        let participantId = 456;
        let param = { value: someone, valid: isValid };
        let blandPageDetails = new BlandPageDetails(
            'Return to my pin',
            '<h1 class="title">Somebody was added</h1>' +
            // tslint:disable-next-line:max-line-length
            `<p>${someone.firstname.slice(0, 1).toUpperCase()}${someone.firstname.slice(1).toLowerCase()} ${someone.lastname.slice(0, 1).toUpperCase()}. has been added.</p>`,
            BlandPageType.Text,
            BlandPageCause.Success,
            `gathering/${gatheringId}`
        );

        (<jasmine.Spy>mockPinService.addToGroup).and.returnValue(Observable.of({}));
        comp.gatheringId = gatheringId;
        comp.participantId = participantId;

        comp.onSubmit(param);

        expect(<jasmine.Spy>mockStateService.setLoading).toHaveBeenCalledWith(true);
        expect(<jasmine.Spy>mockPinService.addToGroup).toHaveBeenCalledWith(gatheringId, someone);
        expect(<jasmine.Spy>mockBlandPageService.primeAndGo).toHaveBeenCalledWith(blandPageDetails);
    });

    it('should fail to submit', () => {
        let expectedText = '<p>invite failed</p>';
        let someone = new Person('TestFirstname', 'TestLastname', 'person@email.com');
        let isValid = true;
        let gatheringId = 123;
        let participantId = 456;
        let param = { value: someone, valid: isValid };

        mockContentService.getContent.and.returnValue(expectedText);
        mockAppSettings.finderType = 'CONNECT';

        (<jasmine.Spy>mockPinService.addToGroup).and.returnValue(Observable.throw({}));
        comp.gatheringId = gatheringId;
        comp.participantId = participantId;

        comp.onSubmit(param);

        expect(<jasmine.Spy>mockStateService.setLoading).toHaveBeenCalledWith(false);
        expect(<jasmine.Spy>mockPinService.addToGroup).toHaveBeenCalledWith(gatheringId, someone);
        expect(mockToast.error).toHaveBeenCalledWith(expectedText);
    });

});
