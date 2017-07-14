import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PAGINATION_CONTROL_VALUE_ACCESSOR } from 'ngx-bootstrap/pagination/pagination.component';

import { LookupTable } from '../../../models';
import { LookupService } from '../../../services/lookup.service';
import { StateService } from '../../../services/state.service';
import { CreateGroupService } from '../create-group-data.service';
import { BlandPageService } from '../../../services/bland-page.service';
import { meetingFrequencies } from '../../../shared/constants';


@Component({
    selector: 'create-group-page-2',
    templateUrl: './create-group-page-2.component.html',
})
export class CreateGroupPage2Component implements OnInit {
    public meetingTimeForm: FormGroup;
    private isSubmitted: boolean = false;
    private daysOfTheWeek: LookupTable[] = [];
    private meetingFrequencies = meetingFrequencies;

    constructor(private fb: FormBuilder,
                private state: StateService,
                private createGroupService: CreateGroupService,
                private router: Router,
                private locationService: Location,
                private lookupService: LookupService,
                private blandPageService: BlandPageService) { }

    ngOnInit() {
        this.state.setPageHeader('start a group', '/create-group/page-1');
        this.meetingTimeForm = this.fb.group({
            meetingTimeType: [this.createGroupService.meetingTimeType, Validators.required],
            meetingTime: [this.createGroupService.group.meetingTime, Validators.required],
            meetingDay: [this.createGroupService.group.meetingDayId, Validators.required],
            meetingFrequency: [this.createGroupService.group.meetingFrequencyId, Validators.required]
        });

        this.lookupService.getDaysOfTheWeek()
            .finally(() => {
                this.state.setLoading(false);
            })
            .subscribe(days => {
                this.daysOfTheWeek = days;
            }, err => {
                console.log(err);
                this.blandPageService.goToDefaultError('/');
            });
    }

    private onClick(value) {
        this.createGroupService.meetingTimeType = value;
        if (value !== 'specific') {
            this.meetingTimeForm.controls['meetingTime'].setValidators(null);
            this.meetingTimeForm.controls['meetingDay'].setValidators(null);
            this.meetingTimeForm.controls['meetingFrequency'].setValidators(null);
        } else {
            this.meetingTimeForm.controls['meetingTime'].setValidators(Validators.required);
            this.meetingTimeForm.controls['meetingDay'].setValidators(Validators.required);
            this.meetingTimeForm.controls['meetingFrequency'].setValidators(Validators.required);
        }

        this.meetingTimeForm.controls['meetingTime'].updateValueAndValidity();
        this.meetingTimeForm.controls['meetingDay'].updateValueAndValidity();
        this.meetingTimeForm.controls['meetingFrequency'].updateValueAndValidity();
    }

    public onSubmit(form: FormGroup) {
        this.state.setLoading(true);
        this.isSubmitted = true;
        if (form.valid) {
            this.router.navigate(['/create-group/page-3']);
        } else {
            this.state.setLoading(false);
        }
    }

    public back() {
        this.locationService.back();
    }
}
