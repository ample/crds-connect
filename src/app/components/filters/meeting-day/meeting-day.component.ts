import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';

import { FilterService } from '../filter.service';
import { SimpleSelectable } from '../../../models/simple-selectable';
import { daysOfWeek } from '../../../shared/constants';

@Component({
  selector: 'meeting-day',
  templateUrl: './meeting-day.component.html'
})

export class MeetingDayComponent implements OnInit {

  public selectableDaysOfWeek: SimpleSelectable[] = [];

  constructor(private filterService: FilterService) { }

  public ngOnInit(): void {
    this.selectableDaysOfWeek = this.filterService.buildArrayOfSelectables(daysOfWeek);
    this.setSelectedFilter();
  }

  private onClickToSelect(selectedDay: SimpleSelectable): void {
    selectedDay.isSelected = !selectedDay.isSelected;
    this.setFilterString();
  }

  private setSelectedFilter(): void {
    if (this.filterService.filterStringMeetingDays != null) {
      const selectedDays = this.filterService.filterStringMeetingDays.replace(/(\(or)|( )|'|\)/g, '').split('groupmeetingday:').slice(1);
      selectedDays.forEach(element => {
        this.selectableDaysOfWeek.find((day) => { return day.value === element; }).isSelected = true;
      });
    }
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
