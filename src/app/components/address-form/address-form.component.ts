import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { AddressService } from '../../services/address.service';
import { Address } from '../../models/address';

import { usStatesList } from '../../shared/constants';

@Component({
  selector: 'address-form',
  templateUrl: 'address-form.component.html'
})
export class AddressFormComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() groupName: string;
  @Input() address: Address;
  @Input() isFormSubmitted: boolean;
  @Input() errorClasses: string = 'error help-block';
  public addressFormGroup: FormGroup;
  private formName: string;
  public stateList: Array<string>;

  constructor(private fb: FormBuilder,
              private addressHlpr: AddressService) {}

  public ngOnInit() {
    this.stateList = usStatesList;
    this.addressFormGroup = new FormGroup({
        addressLine1: new FormControl(this.address.addressLine1, [Validators.required]),
        addressLine2: new FormControl(this.address.addressLine2),
        city: new FormControl(this.address.city, [Validators.required]),
        state: new FormControl(this.address.state, [Validators.required]),
        zip: new FormControl(this.address.zip, [Validators.required])
    });

    this.parentForm.addControl(this.groupName, this.addressFormGroup);

    // TODO: Remove this and do it in whatever parent form needs this and remove emitter.
    if (this.groupName === 'groupAddress') {
      this.addressHlpr.groupAddressFormFieldClearEmitter.subscribe(() => {
        this.parentForm.removeControl(this.groupName);
      });
    }
  }
}
