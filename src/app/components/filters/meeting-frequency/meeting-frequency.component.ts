import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';

import { FilterService } from '../../../services/filter.service';
import { SimpleSelectable } from '../../../models/simple-selectable';
import { meetingFrequencyNames } from '../../../shared/constants';

@Component({
    selector: 'meeting-frequency',
    templateUrl: '/meeting-frequency.component.html'
})

export class MeetingFrequencyComponent implements OnInit {

  public selectableMeetingFrequencies: SimpleSelectable[] = [];

  constructor(private filterService: FilterService) { }

  public ngOnInit(): void {
    this.selectableMeetingFrequencies = this.filterService.buildArrayOfSelectables(meetingFrequencyNames);
  }

  public onClickToSelect(selectedFrequency: SimpleSelectable): void {
    selectedFrequency.isSelected = !selectedFrequency.isSelected;
    this.setFilterString();
  }

  public setFilterString(): void {
    this.filterService.setFilterStringMeetingFrequencies(this.selectableMeetingFrequencies);
  }

  public reset(): void {
    for (let day of this.selectableMeetingFrequencies) {
        day.isSelected = false;
    }
  }

}
