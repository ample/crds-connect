import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Angulartics2 } from 'angulartics2';
import { Observable, Subscription } from 'rxjs/Rx';

import { AppSettingsService } from '../../../services/app-settings.service';
import { FilterService } from '../../../services/filter.service';
import { LookupService } from '../../../services/lookup.service';

import { GroupType } from '../../../models/group-type';
import { Pin, pinType } from '../../../models/pin';

import { awsFieldNames } from '../../../shared/constants';

@Component({
  selector: 'group-type',
  templateUrl: 'group-type.component.html'
})


export class GroupTypeComponent implements OnInit {
  private selected: boolean = false;
  private groupTypes: GroupType[];
  private isAllDataLoaded: boolean = false;

  constructor( private appSettings: AppSettingsService,
               private lookupService: LookupService,
               private filterService: FilterService) { }

  public ngOnInit(): void {
    this.initializeGroupTypes();
  }

  public clickToSelect(value: string) {
    this.setSelection(value);
    this.setFilterString();
  }

  private initializeGroupTypes(): void {
    this.lookupService.getGroupTypes().subscribe(
      groupTypes => {
        this.groupTypes = [];
        for (let groupType of groupTypes.attributes) {
          let theGroupType = new GroupType(groupType);
          this.groupTypes.push(theGroupType);
        }
        this.isAllDataLoaded = true;
      }
    );
  }

  private setSelection(selectedValue: string) {
    let group = this.groupTypes.find(i => i.attribute.name === selectedValue);
    if ( group != null) {
      group.selected = !group.selected;
    }
  }

  private setFilterString(): void {
    this.filterService.setFilterStringAgeGroups(this.groupTypes);
  }

  public reset() {
    for (let groupType of this.groupTypes) {
      groupType.selected = false;
    }
  }
}
