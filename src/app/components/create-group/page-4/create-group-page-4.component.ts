import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PAGINATION_CONTROL_VALUE_ACCESSOR } from 'ngx-bootstrap/pagination/pagination.component';
import { Observable } from 'rxjs';

import { Address, Attribute } from '../../../models';
import { BlandPageService } from '../../../services/bland-page.service';
import { LookupService } from '../../../services/lookup.service';
import { StateService } from '../../../services/state.service';
import { CreateGroupService } from '../create-group-data.service';
import { MiddleSchoolAgeRangeAttributeId, HighSchoolAgeRangeAttributeId } from '../../../shared/constants';


@Component({
    selector: 'create-group-page-4',
    templateUrl: './create-group-page-4.component.html',
})
export class CreateGroupPage4Component implements OnInit {
    public groupMetaDataForm: FormGroup;
    private genderMixTypes: Attribute[] = [];
    private ageRanges: Attribute[] = [];

    private isComponentReady: boolean = false;
    private isSubmitted: boolean = false;
    private isStudentMinistrySelected: boolean;
    private groupGenderMixInvalid: boolean = false;
    private selectedAgeRangesInvalid: boolean = false;

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
            this.lookupService.getGroupGenderMixTypes(),
            this.lookupService.getAgeRanges()
            )
            .finally(() => {
                this.state.setLoading(false);
                this.isComponentReady = true;
            })
            .subscribe(
                lookupResults => {
                    this.genderMixTypes = lookupResults[0].attributes;
                    this.ageRanges = lookupResults[1].attributes;
                    this.setSelectedAgeRanges();
                    this.setIsStudentMinistrySelected();
                },
                error => {
                    this.blandPageService.goToDefaultError('/create-group/page-3');
                }
            );

    }

    private onClickMixType(value: Attribute): void {
        this.groupGenderMixInvalid = false;
        this.createGroupService.selectedGroupGenderMix = value;
    }

    private setSelectedAgeRanges(): void {
        this.createGroupService.selectedAgeRanges.forEach((ageRange: Attribute) => {
            let foundRange = this.ageRanges.find((range: Attribute) => {
                return range.attributeId === ageRange.attributeId;
            });
            if (foundRange) {
                foundRange.selected = true;
            }
        });
    }

    private onClickAgeRange(value: Attribute): void {
        this.selectedAgeRangesInvalid = false;
        let isSelected = this.createGroupService.selectedAgeRanges.find((ageRange) => {
            return ageRange.attributeId === value.attributeId;
        });

        if (isSelected) {
            value.selected = false;
            this.createGroupService.selectedAgeRanges = this.createGroupService.selectedAgeRanges.filter((ageRange) => {
                return ageRange.attributeId !== value.attributeId;
            });
        } else {
            value.selected = true;
            this.createGroupService.selectedAgeRanges.push(value);
        }
        if (this.createGroupService.selectedAgeRanges.length < 1) {
            this.selectedAgeRangesInvalid = true;
        }
        this.setIsStudentMinistrySelected();
    }

    private setIsStudentMinistrySelected() {
        this.isStudentMinistrySelected = this.createGroupService.selectedAgeRanges.find((ageRange) => {
            return ageRange.attributeId === MiddleSchoolAgeRangeAttributeId || ageRange.attributeId === HighSchoolAgeRangeAttributeId;
        }) != null;
    }

    public onSubmit(form: FormGroup) {
        this.state.setLoading(true);
        this.isSubmitted = true;
        if (this.validateForm()) {
            this.createGroupService.addAgeRangesToGroupModel();
            this.createGroupService.addGroupGenderMixTypeToGroupModel();
            this.createGroupService.group.minorAgeGroupsAdded = this.isStudentMinistrySelected;
            this.router.navigate(['/create-group/page-5']);
        } else {
            this.state.setLoading(false);
        }
    }

    private validateForm(): boolean {
        let returnValue = true;
        if (this.createGroupService.selectedGroupGenderMix.attributeId === 0) {
            returnValue = false;
            this.groupGenderMixInvalid = true;
        }
        if (this.createGroupService.selectedAgeRanges.length < 1) {
            returnValue = false;
            this.selectedAgeRangesInvalid = true;
        }

        return returnValue;
    }

    public back() {
        this.locationService.back();
    }
}