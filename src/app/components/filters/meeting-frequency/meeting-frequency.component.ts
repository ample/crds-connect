import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';

import { FilterService } from '../filter.service';
import { SimpleSelectable } from '../../../models/simple-selectable';
import { meetingFrequencyNames } from '../../../shared/constants';

@Component({
    selector: 'meeting-frequency',
    templateUrl: './meeting-frequency.component.html'
})

export class MeetingFrequencyComponent implements OnInit {

  public selectableMeetingFrequencies: SimpleSelectable[] = [];

  constructor(private filterService: FilterService) { }

  public ngOnInit(): void {
    this.selectableMeetingFrequencies = this.filterService.buildArrayOfSelectables(meetingFrequencyNames);
    this.setSelectedFilter();
  }

  private setSelectedFilter(): void {
    if (this.filterService.filterStringMeetingFrequencies != null) {
      const selectedDays = this.filterService.filterStringMeetingFrequencies.replace(/(\(or )|'|\)/g, '').split('groupmeetingfrequency:').slice(1)
      selectedDays.forEach(element => {
        this.selectableMeetingFrequencies.find((day) => { return day.value === element.trim(); }).isSelected = true;
      });
    }
  }

  public onClickToSelect(selectedFrequency: SimpleSelectable): void {
    selectedFrequency.isSelected = !selectedFrequency.isSelected;
    this.setFilterString();
  }

  public setFilterString(): void {
    this.filterService.setFilterStringMeetingFrequencies(this.selectableMeetingFrequencies);
  }

  public reset(): void {
    for (const day of this.selectableMeetingFrequencies) {
        day.isSelected = false;
    }
  }

}
