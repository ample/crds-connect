import { Angulartics2 } from 'angulartics2';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { AppSettingsService } from '../../../services/app-settings.service';
import { FilterService } from '../../../services/filter.service';
import { LookupService } from '../../../services/lookup.service';
import { AgeGroup } from '../../../models/age-group';
import { awsFieldNames } from '../../../shared/constants';

@Component({
  selector: 'meeting-frequency',
  templateUrl: 'meeting-frequency.component.html'
})


export class MeetingFrequencyComponent implements OnInit {
  private selected: boolean = false;
  private ageGroups: AgeGroup[];

  constructor( private appSettings: AppSettingsService,
               private lookupService: LookupService,
               private filterService: FilterService) { }

  public ngOnInit(): void {
    this.initializeAgeGroups();
  }

  public clickToSelect(value: string) {
    this.setSelection(value);
    this.setFilterString();
  }

 private initializeAgeGroups(): void {
      this.lookupService.getAgeRanges().subscribe(
          ages => {
            this.ageGroups = [];
            for (let age of ages.attributes) {
                let theAge = new AgeGroup(age);
                this.ageGroups.push(theAge);
            }
          }
      );
  }

  private setSelection(selectedValue: string) {
    let group = this.ageGroups.find(i => i.attribute.name === selectedValue);
    if ( group != null) {
      group.selected = !group.selected;
    }
  }

  private setFilterString(): void {
    this.filterService.setFilterStringAgeGroups(this.ageGroups);
  }

  public reset() {
    for (let age of this.ageGroups) {
      age.selected = false;
    }
  }
}
