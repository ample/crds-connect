import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';

import { FilterService } from '../../../services/filter.service';
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
    const selectedDays = this.filterService.getSelectedMeetingDays();
    if (selectedDays) {
      selectedDays.forEach(element => {
        this.selectableDaysOfWeek.find(day => day.value === element).isSelected = true;
      });
    }
  }

  private setFilterString(): void {
    this.filterService.setFilterStringMeetingDays(this.selectableDaysOfWeek);
  }

  public reset(): void {
    for (const day of this.selectableDaysOfWeek) {
      day.isSelected = false;
    }
  }

}
