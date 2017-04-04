/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { PinService } from '../../services/pin.service';
import { StateService } from '../../services/state.service';
import { AddMeToTheMapHelperService } from '../../services/add-me-to-map-helper.service';
import { LookupTable } from '../../models/lookup-table';
import { AddressFormComponent } from './address-form.component';
import { Observable } from 'rxjs/Observable';

describe('AddressFormComponent', () => {
    let fixture: ComponentFixture<AddressFormComponent>;
    let comp: AddressFormComponent;
    let el;

    let mockPinService, mockStateService, mockFormBuilder, mockAddMeToTheMapHelperService;

    beforeEach(() => {
        mockPinService = jasmine.createSpyObj<PinService>('pinService', ['postPin']);
        mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading']);
        mockFormBuilder = jasmine.createSpyObj<FormBuilder>('formBuilder', ['constructor']);
        mockAddMeToTheMapHelperService = jasmine.createSpyObj<AddMeToTheMapHelperService>('addMeToTheMapHelperService', ['getStringField', 'createNewPin']);

        TestBed.configureTestingModule({
            declarations: [
                AddressFormComponent
            ],
            providers: [
                { provide: StateService, useValue: mockStateService },
                { provide: PinService, useValue: mockPinService },
                { provide: FormBuilder, useValue: mockFormBuilder },
                { provide: AddMeToTheMapHelperService, useValue: mockAddMeToTheMapHelperService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(AddressFormComponent);
            comp = fixture.componentInstance;

            comp.userData = {
                firstname: 'Joe',
                lastname: 'Kerstanoff',
                email: 'jkerstanoff@callibrity.com',
                contactId: 2562378,
                participantId: 7537153,
                address: {
                    addressId: 5272699,
                    addressLine1: '8854 Penfield Way',
                    addressLine2: null,
                    city: 'Maineville',
                    state: 'OH',
                    zip: '45039-9731',
                    foreignCountry: 'United States',
                    county: null,
                    longitude: null,
                    latitude: null
                },
                householdId: 21,
                password: null
            };

            // el = fixture.debugElement.query(By.css('h1'));
        });
    }));

    fit('should enter the assertion', () => {
        fixture.detectChanges();
        expect(comp).toBeTruthy();
    });

    fit('onInit should load statelist', () => {
        comp.ngOnInit();
        expect(comp.stateList.length).toBe(51);
    });

    fit('should setSubmissionErrorWarningTo', () => {
        comp.setSubmissionErrorWarningTo(true);
        expect(comp.submissionError).toBe(true);

        comp.setSubmissionErrorWarningTo(false);
        expect(comp.submissionError).toBe(false);
    });

    fit('should submit', () => {
        (<jasmine.Spy>mockPinService.postPin).and.returnValue(Observable.of({}));
        spyOn(comp.save, 'emit');

        comp.ngOnInit();
        comp.addressFormGroup.setValue({
            addressLine1: '123 street', addressLine2: '', city: 'Oakley', zip: '12345',
            state: 'OH', foreignCountry: 'US', county: null
        });
        comp.onSubmit(comp.addressFormGroup);
        expect(mockPinService.postPin).toHaveBeenCalled();
        expect(comp.save.emit).toHaveBeenCalledWith(true);
    });
});
