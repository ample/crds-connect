import { Angulartics2 } from 'angulartics2';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';

import { FilterService } from '../../../services/filter.service';
import { SimpleSelectable } from "../../../models/simple-selectable";
import { groupMeetingTimeRanges } from '../../../shared/constants';

@Component({
    selector: 'meeting-time',
    templateUrl: '/meeting-time.component.html'
})

export class MeetingTimeComponent implements OnInit {

    private selected: boolean = false;
    private selectableTimeRanges: SimpleSelectable[] = [];

    constructor(private filterService: FilterService) { }

    public ngOnInit(): void {
        this.selectableTimeRanges = this.filterService.buildArrayOfSelectables(groupMeetingTimeRanges);
    }

    private onClickToSelect(selectedTime: SimpleSelectable): void {
        selectedTime.isSelected = !selectedTime.isSelected;
    }

    private setFilterString(): void {
        this.filterService.setFilterStringMeetingDays(this.selectableTimeRanges);
    }

    public reset(): void {
        for (let day of this.selectableTimeRanges) {
            day.isSelected = false;
        }
    }

}
