import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';

import { FilterService } from '../filter.service';
import { SimpleSelectable } from '../../../models/simple-selectable';
import { groupMeetingTimeRanges } from '../../../shared/constants';

@Component({
    selector: 'meeting-time',
    templateUrl: './meeting-time.component.html'
})

export class MeetingTimeComponent implements OnInit {

    private selected: boolean = false;
    public selectableTimeRanges: SimpleSelectable[] = [];

    constructor(private filterService: FilterService) { }

    public ngOnInit(): void {
        this.selectableTimeRanges = this.filterService.buildArrayOfSelectables(groupMeetingTimeRanges);
        this.setSelectedFilter();
    }

    private setSelectedFilter(): void {
      if (this.filterService.filterStringMeetingTimes != null) {
        const selectedAwsTimes = this.filterService.filterStringMeetingTimes.replace(/(\(or )|: |  \)|/g, '').split('groupmeetingtime').slice(1);
        selectedAwsTimes.forEach(element => {
          const meetingTime = this.filterService.getTimeOfDayFromAwsTimeString(element.trim());
          this.selectableTimeRanges.find(time => time.value === meetingTime).isSelected = true;
        });
      }
    }

    public onClickToSelect(selectedTime: SimpleSelectable): void {
        selectedTime.isSelected = !selectedTime.isSelected;
        this.setFilterString();
    }

    public setFilterString(): void {
        this.filterService.setFilterStringMeetingTimes(this.selectableTimeRanges);
    }

    public reset(): void {
        for (const time of this.selectableTimeRanges) {
            time.isSelected = false;
        }
    }

}
