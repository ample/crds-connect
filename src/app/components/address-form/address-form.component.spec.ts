import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { AddressFormComponent } from './address-form.component';
import { MockTestData } from '../../shared/MockTestData';
import { Address } from '../../models/address';

describe('AddressFormComponent', () => {
  let fixture: ComponentFixture<AddressFormComponent>;
  let comp: AddressFormComponent;
  let el;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddressFormComponent
      ],
      providers: [
        FormBuilder
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

    });
  }));

  it('should create instance', () => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
    expect(comp.addressFormGroup.controls['addressLine1'].value).toBe('8854 Penfield Way');
  });
});
