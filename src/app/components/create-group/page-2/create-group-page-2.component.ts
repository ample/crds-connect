import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PAGINATION_CONTROL_VALUE_ACCESSOR } from 'ngx-bootstrap/pagination/pagination.component';

import { BlandPageService } from '../../../services/bland-page.service';
import { CreateGroupService } from '../create-group-data.service';
import { GroupService} from '../../../services/group.service';
import { LookupService } from '../../../services/lookup.service';
import { StateService } from '../../../services/state.service';
import { TimeHelperService} from '../../../services/time-helper.service';

import { LookupTable } from '../../../models';

import { defaultGroupMeetingTime, meetingFrequencies,
         groupMeetingScheduleType, GroupMeetingScheduleType,
         GroupPaths, groupPaths, GroupPageNumber,
         defaultGroupMeetingTimePrefix, defaultGroupMeetingTimeSuffix } from '../../../shared/constants';


@Component({
  selector: 'create-group-page-2',
  templateUrl: './create-group-page-2.component.html',
  styles: [`
    form > div:nth-child(2) .row div:last-child {
      white-space: normal;
      text-align: left;
    }
    @media (min-width: 600px) {
      form > div:nth-child(2) .row div:last-child {
        text-align: right;
      }
    }
  `]
})
export class CreateGroupPage2Component implements OnInit {
  public meetingTimeForm: FormGroup;
  private timeZoneAdjustedDefaultGroupMeetingTime: string;
  private isSubmitted: boolean = false;
  private groupMeetingScheduleType: GroupMeetingScheduleType = groupMeetingScheduleType;
  private daysOfTheWeek: LookupTable[] = [];
  private meetingFrequencies = meetingFrequencies;

  constructor(private fb: FormBuilder,
              private state: StateService,
              private createGroupService: CreateGroupService,
              private groupService: GroupService,
              private router: Router,
              private lookupService: LookupService,
              private blandPageService: BlandPageService,
              private timeHlpr: TimeHelperService) { }

  ngOnInit() {
    let pageHeader = (this.state.getActiveGroupPath() === groupPaths.EDIT) ? 'edit my group' : 'start a group';
    this.state.setPageHeader(pageHeader, '/create-group/page-1');

    this.meetingTimeForm = this.initializeGroupMeetingScheduleForm();
    this.meetingTimeForm = this.setRequiredFormFields(this.meetingTimeForm, this.createGroupService.meetingTimeType);
    this.meetingTimeForm = this.updateValueAndValidityOfAllFields(this.meetingTimeForm);

    if(this.state.getActiveGroupPath() === groupPaths.EDIT) {
      this.setFieldsFromExistingGroup();
    }

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

      this.timeZoneAdjustedDefaultGroupMeetingTime = this.timeHlpr
          .adjustUtcStringToAccountForLocalOffSet(defaultGroupMeetingTime, false)
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
    this.groupService.navigateInGroupFlow(GroupPageNumber.ONE, this.state.getActiveGroupPath(), this.createGroupService.group.groupId);
  }

  public onSubmit(form: FormGroup) {
    this.state.setLoading(true);
    this.isSubmitted = true;
    if (form.valid) {
      this.groupService.navigateInGroupFlow(GroupPageNumber.THREE, this.state.getActiveGroupPath(), this.createGroupService.group.groupId);
    } else {
      this.state.setLoading(false);
    }
  }

  private initializeGroupMeetingScheduleForm(): FormGroup {
    this.createGroupService.group.meetingTime = this.createGroupService.group.meetingTime
                                                || this.timeZoneAdjustedDefaultGroupMeetingTime;
    return this.fb.group({
      meetingTimeType: [this.createGroupService.meetingTimeType, Validators.required],
      meetingTime: [this.createGroupService.group.meetingTime],
      meetingDay: [this.createGroupService.group.meetingDayId],
      meetingFrequency: [this.createGroupService.group.meetingFrequency]
    });
  }

  private makeSpecificTimeFormSectionRequired(form: FormGroup): FormGroup {
    form.controls['meetingTime'].setValidators(Validators.required);
    form.controls['meetingDay'].setValidators(Validators.required);
    form.controls['meetingFrequency'].setValidators(Validators.required);

    return form;
  }

  private removeValidationOnSpecificTimeFormSection(form: FormGroup): FormGroup {
    form.controls['meetingTime'].setValidators(null);
    form.controls['meetingDay'].setValidators(null);
    form.controls['meetingFrequency'].setValidators(null);

    return form;
  }

  private setRequiredFormFields(form: FormGroup, meetingTimeType: string): FormGroup {
    if (meetingTimeType === groupMeetingScheduleType.SPECIFIC_TIME_AND_DATE) {
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

  private onDayChange(value): void {
    let day: LookupTable = this.daysOfTheWeek.find((aDay: LookupTable) => {
      return aDay.dp_RecordID === +value;
    });
    this.createGroupService.group.meetingDay = day.dp_RecordName;
  }

  private onFrequencyChange(value): void {
    let frequency = this.meetingFrequencies.find((freq) => {
      return freq.meetingFrequencyId === +value;
    });
    this.createGroupService.group.meetingFrequency = frequency.meetingFrequencyDesc;
  }

  private setFieldsFromExistingGroup(): void {
    let isGroupOnFlexibleScedule: boolean = this.createGroupService.groupBeingEdited.meetingDayId === null;

    if(isGroupOnFlexibleScedule) {
      this.onClick(groupMeetingScheduleType.FLEXIBLE);
    } else {
      this.createGroupService.group.meetingFrequencyId =
        +this.createGroupService.groupBeingEdited['meetingFrequencyID'];
      this.createGroupService.group.meetingTime =
        this.timeHlpr.setTimeToCorrectFormatAndAdjustForLocal(this.createGroupService.groupBeingEdited.meetingTime);
      this.createGroupService.group.meetingDay = this.createGroupService.groupBeingEdited.meetingDay;
      this.createGroupService.group.meetingDayId = this.createGroupService.groupBeingEdited.meetingDayId;
    }
  }

}
