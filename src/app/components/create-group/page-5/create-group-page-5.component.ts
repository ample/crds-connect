import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Address } from '../../../models';
import { Attribute } from '../../../models';
import { BlandPageService } from '../../../services/bland-page.service';
import { LookupService } from '../../../services/lookup.service';
import { StateService } from '../../../services/state.service';
import { CreateGroupService } from '../create-group-data.service';


@Component({
    selector: 'create-group-page-5',
    templateUrl: './create-group-page-5.component.html',
})
export class CreateGroupPage5Component implements OnInit {
    public groupDetailsForm: FormGroup;

    private isComponentReady: boolean = false;
    private isSubmitted: boolean = false;
    private groupVisabilityInvalid: boolean = false;

    constructor(private fb: FormBuilder,
                private state: StateService,
                private createGroupService: CreateGroupService,
                private router: Router,
                private locationService: Location,
                private lookupService: LookupService,
                private blandPageService: BlandPageService) { }

    ngOnInit() {
        this.state.setPageHeader('start a group', '/create-group/page-4');
        this.groupDetailsForm = this.fb.group({
            groupName: [this.createGroupService.group.groupName, Validators.required],
            groupDescription: [this.createGroupService.group.groupDescription, Validators.required],
            availableOnline: [this.createGroupService.group.availableOnline]
        });
        this.state.setLoading(false);
    }

    private onClick(value: boolean): void {
        this.groupVisabilityInvalid = false;
        this.createGroupService.group.availableOnline = value;
    }

    public onSubmit(form: FormGroup) {
        this.isSubmitted = true;
        if (form.valid && this.createGroupService.group.availableOnline != null) {
            // this.router.navigate(['/create-group/page-6']);
        } else {
            this.groupVisabilityInvalid = true;
        }
    }


    public back() {
        this.locationService.back();
    }
}
