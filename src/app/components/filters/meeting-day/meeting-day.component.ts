import { Angulartics2 } from 'angulartics2';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';

import { FilterService } from '../../../services/filter.service';
import { SimpleSelectable } from "../../../models/simple-selectable";
import { daysOfWeek } from '../../../shared/constants';

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

  private onClickToSelect(selectedDay: SimpleSelectable): void {
    selectedDay.isSelected = !selectedDay.isSelected;
  }

  private setFilterString(): void {
    this.filterService.setFilterStringMeetingDays(this.selectableDaysOfWeek);
  }

  public reset(): void {
    for (let day of this.selectableDaysOfWeek) {
      day.isSelected = false;
    }
  }

}
