import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { AppSettingsService } from '../../../services/app-settings.service';
import { FilterService } from '../filter.service';
import { LookupService } from '../../../services/lookup.service';
import { AgeGroup } from '../../../models/age-group';
import { awsFieldNames } from '../../../shared/constants';

@Component({
  selector: 'age-groups',
  templateUrl: 'age-groups.component.html'
})


export class AgeGroupsComponent implements OnInit {
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
            for (const age of ages.attributes) {
                const theAge = new AgeGroup(age);
                this.ageGroups.push(theAge);
            }
            this.setSelectedAgeGroups();
          }
      );
  }

  private setSelectedAgeGroups(): void {
    if (this.filterService.filterStringAgeGroups != null) {
    const selectedFilters = this.filterService.filterStringAgeGroups.replace(/(\(or )|: |'|\)/g, '').split('groupagerange').slice(1);
    selectedFilters.forEach(element => {
      this.setSelection(element.trim());
    });
  }
  }

  private setSelection(selectedValue: string) {
    const group = this.ageGroups.find(i => i.attribute.name === selectedValue);
    if ( group != null) {
      group.selected = !group.selected;
    }
  }

  private setFilterString(): void {
    this.filterService.setFilterStringAgeGroups(this.ageGroups);
  }

  public reset() {
    for (const age of this.ageGroups) {
      age.selected = false;
    }
  }
}
