/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Location } from '@angular/common';

import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { AddressService } from '../../services/address.service';
import { PinService } from '../../services/pin.service';
import { StateService } from '../../services/state.service';
import { LookupTable } from '../../models/lookup-table';
import { AddressFormComponent } from './address-form.component';
import { Observable } from 'rxjs/Observable';
import { MockTestData } from '../../shared/MockTestData';
import { Address } from '../../models/address';

describe('AddressFormComponent', () => {
    let fixture: ComponentFixture<AddressFormComponent>;
    let comp: AddressFormComponent;
    let el;

    let mockPinService, mockStateService, mockLocation, mockAddressService;

    beforeEach(() => {
        mockPinService = { postPin: jest.fn() };
        mockStateService = { setLoading: jest.fn() };
        mockLocation = {back: jest.fn() };
		mockAddressService = { getFullAddress: jest.fn() };
        TestBed.configureTestingModule({
            declarations: [
                AddressFormComponent
            ],
            providers: [
                { provide: AddressService, useValue: mockAddressService },
                { provide: StateService, useValue: mockStateService },
                { provide: PinService, useValue: mockPinService },
                FormBuilder,
                { provide: Location, useValue: mockLocation }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(AddressFormComponent);
            comp = fixture.componentInstance;

            comp.address = new Address(123, '8854 Penfield Way', null, 'Maineville', 'OH',
                                       '45039-9731', null, null, 'United States', 'county');
            comp.groupName = 'addressForm';
            comp.isFormSubmitted = false;
            comp.parentForm = new FormGroup({});

            // el = fixture.debugElement.query(By.css('h1'));
        });
    }));

    it('should create instance', () => {
        fixture.detectChanges();
        expect(comp).toBeTruthy();
    });
});
