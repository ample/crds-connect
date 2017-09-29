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
            for (let age of ages.attributes) {
                let theAge = new AgeGroup(age);
                this.ageGroups.push(theAge);
            }
            this.setSelectedAgeGroups();
          }
      );
  }

  private setSelectedAgeGroups(): void {
    if (this.filterService.filterStringAgeGroups != null) {
    const selectedFilters = this.filterService.filterStringAgeGroups.replace(/['() ]/g, '').replace('or', '').split('groupagerange:');
    selectedFilters.forEach(element => {
      this.setSelection(element);
    });
  }
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
