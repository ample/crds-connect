import { Angulartics2 } from 'angulartics2';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { AppSettingsService } from '../../../services/app-settings.service';
import { FilterService } from '../../../services/filter.service';
import { LookupService } from '../../../services/lookup.service';
import { AgeGroup } from '../../../models/age-group';
import { awsFieldNames, daysOfWeek } from '../../../shared/constants';
import {SimpleSelectable} from "../../../models/simple-selectable";

@Component({
  selector: 'meeting-day',
  templateUrl: '/meeting-day.component.html'
})


export class MeetingDayComponent implements OnInit {

  private selected: boolean = false;
  private selectableDaysOfWeek: SimpleSelectable[] = [];

  constructor(private filterService: FilterService) { }

  public ngOnInit(): void {
    this.selectableDaysOfWeek = this.filterService.getSelectableDaysOfTheWeek(daysOfWeek);
  }

  private onClickToSelect(selectedDay: SimpleSelectable) {
    selectedDay.isSelected = true;
  }


  private setFilterString(): void {
    this.filterService.setFilterStringMeetingDays(this.selectableDaysOfWeek);
  }


  public reset() {
    for (let day of this.selectableDaysOfWeek) {
      day.isSelected = false;
    }
  }
}
