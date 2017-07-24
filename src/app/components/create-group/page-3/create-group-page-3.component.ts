import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Address } from '../../../models';
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

    private meetingFrequencies: Array<any> = meetingFrequencies;

    constructor(private fb: FormBuilder,
                private state: StateService,
                private createGroupService: CreateGroupService,
                private router: Router,
                private locationService: Location) { }

    ngOnInit() {
        this.state.setPageHeader('start a group', '/create-group/page-2');
        this.makeSureModelHasAddress();
        this.locationForm = this.fb.group({
            isVirtualGroup: [this.createGroupService.group.isVirtualGroup],
            address: [this.createGroupService.group.address.addressLine1],
            city: [this.createGroupService.group.address.city],
            state: [this.createGroupService.group.address.state],
            zip: [this.createGroupService.group.address.zip],
            kidsWelcome: [this.createGroupService.group.kidsWelcome]
        });
        this.setRequiredFields(this.createGroupService.group.isVirtualGroup);
        this.state.setLoading(false);

    }

    private onClickIsVirtual(value: boolean): void {
        this.createGroupService.group.isVirtualGroup = value;
        this.setRequiredFields(value);
    }

    private makeSureModelHasAddress(): void {
        if (this.createGroupService.group.address == null) {
            this.createGroupService.group.address = Address.overload_Constructor_One();
        }
    }

    private setRequiredFields(required: boolean): void {
        if (!required) {
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

    private onClickKidsWelcome(value: boolean): void {
        this.locationForm.controls['kidsWelcome'].setValue(value);
        this.createGroupService.group.kidsWelcome = value;
    }


    public onSubmit(form: FormGroup): void {
        this.isSubmitted = true;
        if (form.valid) {
            this.router.navigate(['/create-group/page-4']);
        }
    }

    public back(): void {
        this.locationService.back();
    }
}
