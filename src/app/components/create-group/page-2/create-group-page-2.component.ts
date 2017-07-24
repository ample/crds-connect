import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PAGINATION_CONTROL_VALUE_ACCESSOR } from 'ngx-bootstrap/pagination/pagination.component';

import { BlandPageService } from '../../../services/bland-page.service';
import { CreateGroupService } from '../create-group-data.service';
import { LookupService } from '../../../services/lookup.service';
import { StateService } from '../../../services/state.service';

import { LookupTable } from '../../../models';

import { defaultGroupMeetingTime, meetingFrequencies,
         groupMeetingScheduleType, GroupMeetingScheduleType } from '../../../shared/constants';


@Component({
  selector: 'create-group-page-2',
  templateUrl: './create-group-page-2.component.html',
})
export class CreateGroupPage2Component implements OnInit {
  public meetingTimeForm: FormGroup;
  private isSubmitted: boolean = false;
  private groupMeetingScheduleType: GroupMeetingScheduleType = groupMeetingScheduleType;
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

    this.meetingTimeForm = this.initializeGroupMeetingScheduleForm();
    this.meetingTimeForm = this.setRequiredFormFields(this.meetingTimeForm, this.createGroupService.meetingTimeType);
    this.meetingTimeForm = this.updateValueAndValidityOfAllFields(this.meetingTimeForm);

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

  public onClick(scheduleType: string): void {

    this.createGroupService.meetingTimeType = scheduleType;

    if (scheduleType === groupMeetingScheduleType.SPECIFIC_TIME_AND_DATE) {
      this.meetingTimeForm = this.makeSpecificTimeFormSectionRequired(this.meetingTimeForm);
    } else {
      this.meetingTimeForm = this.removeValidationOnSpecificTimeFormSection(this.meetingTimeForm);
    }

    this.meetingTimeForm = this.updateValueAndValidityOfAllFields(this.meetingTimeForm);

  }

  public onBack(): void {
    this.locationService.back();
  }

  public onSubmit(form: FormGroup) {
    this.state.setLoading(true);
    this.isSubmitted = true;
    if (form.valid) {
      this.removeMeetingInfoFromGroupIfFlexible();
      this.router.navigate(['/create-group/page-3']);
    } else {
      this.state.setLoading(false);
    }
  }

  private initializeGroupMeetingScheduleForm(): FormGroup {
    this.createGroupService.group.meetingTime = this.createGroupService.group.meetingTime || defaultGroupMeetingTime;
    return this.fb.group({
      meetingTimeType: [this.createGroupService.meetingTimeType, Validators.required],
      meetingTime: [this.createGroupService.group.meetingTime],
      meetingDay: [this.createGroupService.group.meetingDayId],
      meetingFrequency: [this.createGroupService.group.meetingFrequency]
    })
  }

  private makeSpecificTimeFormSectionRequired(form: FormGroup): FormGroup {
    form.controls['meetingTime'].setValidators(Validators.required);
    form.controls['meetingDay'].setValidators(Validators.required);
    form.controls['meetingFrequency'].setValidators(Validators.required);

    return form;
  }

  private removeMeetingInfoFromGroupIfFlexible(): void {
    if (this.createGroupService.meetingTimeType === groupMeetingScheduleType.FLEXIBLE) {
      this.createGroupService.clearMeetingTimeData();
    }
  }

  private removeValidationOnSpecificTimeFormSection(form: FormGroup): FormGroup {
    form.controls['meetingTime'].setValidators(null);
    form.controls['meetingDay'].setValidators(null);
    form.controls['meetingFrequency'].setValidators(null);

    return form;
  }

  private setRequiredFormFields(form: FormGroup, meetingTimeType: string): FormGroup {
    if(meetingTimeType === groupMeetingScheduleType.SPECIFIC_TIME_AND_DATE){
      this.meetingTimeForm = this.makeSpecificTimeFormSectionRequired(this.meetingTimeForm);
    }

    return form;
  }

  private updateValueAndValidityOfAllFields(form: FormGroup): FormGroup{
    form.controls['meetingTimeType'].updateValueAndValidity();
    form.controls['meetingTime'].updateValueAndValidity();
    form.controls['meetingDay'].updateValueAndValidity();
    form.controls['meetingFrequency'].updateValueAndValidity();

    return form;
  }

}
