import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PAGINATION_CONTROL_VALUE_ACCESSOR } from 'ngx-bootstrap/pagination/pagination.component';

import { Address } from '../../../models';
import { LookupService } from '../../../services/lookup.service';
import { StateService } from '../../../services/state.service';
import { CreateGroupService } from '../create-group-data.service';
import { meetingFrequencies, usStatesList } from '../../../shared/constants';


@Component({
    selector: 'create-group-page-3',
    templateUrl: './create-group-page-3.component.html',
})
export class CreateGroupPage3Component implements OnInit {
    public locationForm: FormGroup;
    private usStatesList: string[] = usStatesList;
    private isSubmitted: boolean = false;

    private meetingFrequencies = meetingFrequencies;

    constructor(private fb: FormBuilder,
                private state: StateService,
                private createGroupService: CreateGroupService,
                private router: Router,
                private locationService: Location,
                private lookupService: LookupService) { }

    ngOnInit() {
        this.state.setPageHeader('start a group', '/create-group/page-2');
        this.locationForm = this.fb.group({
            isInPerson: [this.createGroupService.meetingIsInPerson, Validators.required],
            address: [this.createGroupService.group.address.addressLine1, Validators.required],
            city: [this.createGroupService.group.address.city, Validators.required],
            state: [this.createGroupService.group.address.state, Validators.required],
            zip: [this.createGroupService.group.address.zip, Validators.required],
            kidsWelcome: [this.createGroupService.group.kidsWelcome, Validators.required]
        });
        this.state.setLoading(false);

    }
    private onClickIsOnline(value: boolean): void {
        this.createGroupService.meetingIsInPerson = value;
        this.setRequiredFields(value);
    }

    private setRequiredFields(required: boolean) {
        if (required) {
            this.locationForm.controls['address'].setValidators(Validators.required);
            this.locationForm.controls['city'].setValidators(Validators.required);
            this.locationForm.controls['state'].setValidators(Validators.required);
            this.locationForm.controls['zip'].setValidators(Validators.required);
            this.locationForm.controls['kidsWelcome'].setValidators(Validators.required);
        } else {
            this.locationForm.controls['address'].setValidators(null);
            this.locationForm.controls['city'].setValidators(null);
            this.locationForm.controls['state'].setValidators(null);
            this.locationForm.controls['zip'].setValidators(null);
            this.locationForm.controls['kidsWelcome'].setValidators(null);
        }

        this.locationForm.controls['address'].updateValueAndValidity();
        this.locationForm.controls['city'].updateValueAndValidity();
        this.locationForm.controls['state'].updateValueAndValidity();
        this.locationForm.controls['zip'].updateValueAndValidity();
        this.locationForm.controls['kidsWelcome'].updateValueAndValidity();
    }

    private onClickKidsWelcome(value: boolean) {
        this.locationForm.controls['kidsWelcome'].setValue(value);
        this.createGroupService.group.kidsWelcome = value;
    }


    public onSubmit(form: FormGroup) {
        this.isSubmitted = true;
        if (form.valid) {
            // Do Something
        } else {
            // Do something else
        }
    }

    public back() {
        this.locationService.back();
    }
}
