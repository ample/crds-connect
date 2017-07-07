import { Angulartics2 } from 'angulartics2';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { AppSettingsService } from '../../../services/app-settings.service';
import { FilterService } from '../../../services/filter.service';
import { LookupService } from '../../../services/lookup.service';
import { AgeGroup } from '../../../models/age-group';
import { Pin, pinType } from '../../../models/pin';
import { awsFieldNames } from '../../../shared/constants';

@Component({
  selector: 'age-groups',
  templateUrl: 'age-groups.component.html'
})


export class AgeGroupsComponent implements OnInit {
  private selected: boolean = false;
  private ageGroups: AgeGroup[];

  constructor( private appSettings: AppSettingsService,
               private router: Router,
               private lookupService: LookupService,
               private filterService: FilterService) { }

  public ngOnInit(): void {
    this.initializeAgeGroups();
  }

  public clickToSelect(value: string) {
    this.setSelection(value);
  }

  private initializeAgeGroups(): void {
      this.lookupService.getAgeGroups().subscribe(
          ages => {
            this.ageGroups = [];
            for (let age of ages.attributes) {
                let theAge = new AgeGroup(age);
                this.ageGroups.push(theAge);
            }
            console.log(this.ageGroups);
          }
      );
  }

  private setSelection(selectedValue: string) {
    let group = this.ageGroups.find(i => i.attribute.name === selectedValue);
    if ( group != null) {
      group.selected = !group.selected;
    }
  }

  public onSelect(): void {
        this.selected = !this.selected;
  }

  public setFilterString(): void {
    let addFilterString: string;
    for (let age of this.ageGroups) {
      if (age.selected) {
        // need single quotes around each value since it is a string in aws
        addFilterString = ` (or ${awsFieldNames.GROUP_AGE_RANGE}: \'${age.attribute.name}\' ) `;
      }
    }

    this.filterService.filterStringAgeGroups = this.filterService.filterStringAgeGroups != null ?
                       this.filterService.filterStringAgeGroups + addFilterString
                       : addFilterString;
  }

}
