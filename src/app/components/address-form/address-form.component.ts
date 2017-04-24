import { Address } from '../../models/address';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AddMeToTheMapHelperService } from '../../services/add-me-to-map-helper.service';
import { usStatesList } from '../../shared/constants';
import { UserDataForPinCreation } from '../../models/user-data-for-pin-creation';

@Component({
    selector: 'address-form',
    templateUrl: 'address-form.component.html'
})
export class AddressFormComponent implements OnInit {
    @Input() parentForm: FormGroup;
    @Input() address: Address;
    private addressFormGroup: FormGroup;
    private stateList: Array<string>;

    constructor(private fb: FormBuilder, private hlpr: AddMeToTheMapHelperService) { }

    ngOnInit() {
        this.stateList = usStatesList;
        this.addressFormGroup = new FormGroup({
            addressLine1: new FormControl(this.address.addressLine1, [Validators.required]),
            addressLine2: new FormControl(this.address.addressLine2),
            city: new FormControl(this.address.city, [Validators.required]),
            state: new FormControl(this.address.state, [Validators.required]),
            zip: new FormControl(this.address.zip, [Validators.required])
        });
        this.parentForm.addControl('addressForm', this.addressFormGroup);
     }
}
