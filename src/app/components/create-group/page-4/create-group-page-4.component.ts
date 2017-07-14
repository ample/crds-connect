import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PAGINATION_CONTROL_VALUE_ACCESSOR } from 'ngx-bootstrap/pagination/pagination.component';
import { Observable } from 'rxjs';

import { Address } from '../../../models';
import { Attribute } from '../../../models';
import { BlandPageService } from '../../../services/bland-page.service';
import { LookupService } from '../../../services/lookup.service';
import { StateService } from '../../../services/state.service';
import { CreateGroupService } from '../create-group-data.service';


@Component({
    selector: 'create-group-page-4',
    templateUrl: './create-group-page-4.component.html',
})
export class CreateGroupPage4Component implements OnInit {
    public groupMetaDataForm: FormGroup;
    private genderMixTypes: Attribute[] = [];
    private ageGroups: Attribute[] = [];

    private isSubmitted: boolean = false;

    constructor(private fb: FormBuilder,
                private state: StateService,
                private createGroupService: CreateGroupService,
                private router: Router,
                private locationService: Location,
                private lookupService: LookupService,
                private blandPageService: BlandPageService) { }

    ngOnInit() {
        this.state.setPageHeader('start a group', '/create-group/page-3');
        this.groupMetaDataForm = this.fb.group({
            groupGenderMixType: ['', Validators.required],
            groupAgeRanges: ['', Validators.required]
        });

        Observable.forkJoin(
            this.lookupService.getGroupGenderMixType(),
            this.lookupService.getAgeGroups()
            )
            .finally(() => {
                this.state.setLoading(false);
            })
            .subscribe(
                lookupResults => {
                    this.genderMixTypes = lookupResults[0].attributes;
                    this.ageGroups = lookupResults[1].attributes;
                },
                error => {
                    this.blandPageService.goToDefaultError('/create-group/page-3');
                }
            );

    }
    private onClickIsOnline(value: boolean): void {
        this.createGroupService.meetingIsInPerson = value;
    }

    private onClickKidsWelcome(value: boolean) {
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
