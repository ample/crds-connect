/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { AddressFormComponent } from './address-form.component';
import { ContentBlockModule } from 'crds-ng2-content-block';

import { AddMeToTheMapHelperService } from '../../services/add-me-to-map-helper.service';
import { APIService } from '../../services/api.service';
import { LocationService } from '../../services/location.service';
import { StateService } from '../../services/state.service';

describe('AddressFormComponent', () => {
    let fixture: ComponentFixture<AddressFormComponent>;
    let comp: AddressFormComponent;
    let el;
    let mockAPIService;
    let mockLocationService;
    let mockSessionService;
    let mockPinService;
    let mockLoginRedirectService;
    let mockBlandPageService;
    let mockStateService;

    beforeEach(() => {
        mockAPIService = jasmine.createSpyObj<APIService>('api', ['postPin']);
        mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading']);

        TestBed.configureTestingModule({
            declarations: [
                AddressFormComponent
            ],
            imports: [
                HttpModule,
                ContentBlockModule.forRoot({ categories: ['common'] })
            ],
            providers: [
                { provide: ActivatedRoute, useValue: { snapshot: { data: {} } } },
                { provide: APIService, useValue: mockAPIService },
                { provide: StateService, useValue: mockStateService },
                AddMeToTheMapHelperService,
                FormBuilder
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(AddressFormComponent);
            comp = fixture.componentInstance;
            comp.userData = {
                'firstname': 'Joe',
                'lastname': 'Kerstanoff',
                'email': 'jkerstanoff@callibrity.com',
                'contactId': 2562378,
                'participantId': 7537153,
                'address': {
                    'addressId': 5272699,
                    'addressLine1': '8854 Penfield Way',
                    'addressLine2': null,
                    'city': 'Maineville',
                    'state': 'OH',
                    'zip': '45039-9731',
                    'foreignCountry': 'United States',
                    'county': null,
                    'longitude': null,
                    'latitude': null
                },
                'householdId': 21
            };

            // el = fixture.debugElement.query(By.css('h1'));
        });
    }));

    it('should create an instance', () => {
        expect(comp).toBeTruthy();
    });

    it('onInit should load statelist', () => {
        comp.ngOnInit();
        expect(comp.stateList.length).toBe(51);
    });

    it('should setSubmissionErrorWarningTo', () => {
        comp.setSubmissionErrorWarningTo(true);
        expect(comp.submissionError).toBe(true);

        comp.setSubmissionErrorWarningTo(false);
        expect(comp.submissionError).toBe(false);
    });

    it('should submit', () => {
        (<jasmine.Spy>mockAPIService.postPin).and.returnValue(Observable.of({}));
        spyOn(comp.save, 'emit');

        comp.ngOnInit();
        comp.addressFormGroup.setValue({ addressLine1: '123 street', addressLine2: '', city: 'Oakley', zip: '12345',
        state: 'OH', foreignCountry: 'US', county: null});
        comp.onSubmit(comp.addressFormGroup);
        expect(mockAPIService.postPin).toHaveBeenCalled();
        expect(comp.save.emit).toHaveBeenCalledWith(true);
    });
});
