import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PAGINATION_CONTROL_VALUE_ACCESSOR } from 'ngx-bootstrap/pagination/pagination.component';

import { BlandPageService } from '../../../services/bland-page.service';
import { CreateGroupService } from '../create-group-data.service';
import { GroupService } from '../../../services/group.service';
import { LookupService } from '../../../services/lookup.service';
import { StateService } from '../../../services/state.service';

import { Group } from '../../../models/group';
import { LookupTable } from '../../../models';
import * as moment from 'moment';

import {
  meetingFrequencies,
  groupMeetingScheduleType, GroupMeetingScheduleType,
  GroupPaths, groupPaths, GroupPageNumber,
  textConstants, daysOfWeekList
} from '../../../shared/constants';


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
  public date: Date;
  public meetingTimeForm: FormGroup;
  public isSubmitted: boolean = false;
  public groupMeetingScheduleType: GroupMeetingScheduleType = groupMeetingScheduleType;
  private daysOfTheWeek: LookupTable[] = [];
  private meetingFrequencies = meetingFrequencies;

  constructor(private fb: FormBuilder,
              private state: StateService,
              public createGroupService: CreateGroupService,
              private groupService: GroupService,
              private router: Router,
              private lookupService: LookupService,
              private blandPageService: BlandPageService) { }

  ngOnInit() {
    const pageHeader = (this.state.getActiveGroupPath() === groupPaths.EDIT) ? textConstants.GROUP_PAGE_HEADERS.EDIT
      : textConstants.GROUP_PAGE_HEADERS.ADD;

    const headerBackRoute: string = (this.state.getActiveGroupPath() === groupPaths.EDIT) ?
      `/edit-group/${this.createGroupService.groupBeingEdited.groupId}/page-1`
      : '/create-group/page-1';

    this.state.setPageHeader(pageHeader, headerBackRoute);

    this.setupDate();

    this.meetingTimeForm = this.initializeGroupMeetingScheduleForm();
    this.meetingTimeForm = this.setRequiredFormFields(this.meetingTimeForm, this.createGroupService.meetingTimeType);
    this.meetingTimeForm = this.updateValueAndValidityOfAllFields(this.meetingTimeForm);

    if (this.state.getActiveGroupPath() === groupPaths.EDIT
      && !this.createGroupService.wasPagePresetWithExistingData.page2) {
      this.setFieldsFromExistingGroup();
      this.createGroupService.wasPagePresetWithExistingData.page2 = true;
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
  }

  public setupDate() {
    const dateInTimeZone = new Date(this.createGroupService.group.meetingTime);
    this.date = new Date();
    this.date.setHours(dateInTimeZone.getUTCHours());
    this.date.setMinutes(dateInTimeZone.getUTCMinutes());
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
      if (this.createGroupService.meetingTimeType === groupMeetingScheduleType.FLEXIBLE) {
        this.createGroupService.group = this.clearGroupMeetingDay(this.createGroupService.group);
      }
      const newDate = moment.utc(this.date).hours(this.date.getHours()).minutes(this.date.getMinutes());
      this.createGroupService.group.meetingTime = newDate.toISOString();

      this.groupService.navigateInGroupFlow(GroupPageNumber.THREE, this.state.getActiveGroupPath(),
        this.createGroupService.group.groupId);
    } else {
      Object.keys(form.controls).forEach((name) => {
        form.controls[name].markAsTouched();
      });
      this.state.setLoading(false);
    }
  }

  private initializeGroupMeetingScheduleForm(): FormGroup {
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

  private updateValueAndValidityOfAllFields(form: FormGroup): FormGroup {
    form.controls['meetingTimeType'].updateValueAndValidity();
    form.controls['meetingTime'].updateValueAndValidity();
    form.controls['meetingDay'].updateValueAndValidity();
    form.controls['meetingFrequency'].updateValueAndValidity();

    return form;
  }

  private onDayChange(value): void {
    const day: LookupTable = this.daysOfTheWeek.find((aDay: LookupTable) => {
      return aDay.dp_RecordID === +value;
    });
    this.createGroupService.group.meetingDay = day.dp_RecordName;
  }

  private onFrequencyChange(value): void {
    const frequency = this.meetingFrequencies.find((freq) => {
      return freq.meetingFrequencyId === +value;
    });
    this.createGroupService.group.meetingFrequency = frequency.meetingFrequencyDesc;
  }

  private setFieldsFromExistingGroup(): void {
    const isGroupOnFlexibleScedule: boolean = this.createGroupService.groupBeingEdited.meetingDayId === null;

    if (isGroupOnFlexibleScedule) {
      this.onClick(groupMeetingScheduleType.FLEXIBLE);
    } else {
      this.createGroupService.group.meetingFrequencyId =
        +this.createGroupService.groupBeingEdited['meetingFrequencyID'];
      this.createGroupService.group.meetingFrequency = meetingFrequencies
        .filter(mf => mf.meetingFrequencyId === +this.createGroupService.groupBeingEdited['meetingFrequencyID'])
      [0].meetingFrequencyDesc;

      this.createGroupService.group.meetingDay = daysOfWeekList[this.createGroupService.groupBeingEdited.meetingDayId - 1];
      this.createGroupService.group.meetingDayId = this.createGroupService.groupBeingEdited.meetingDayId;
    }
  }

  private clearGroupMeetingDay(group: Group): Group {
    group.meetingDay = null;
    group.meetingDayId = null;

    return group;
  }

}
