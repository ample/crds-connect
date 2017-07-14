import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Angulartics2 } from 'angulartics2';

import { FilterService } from '../../../services/filter.service';
import { LookupService } from '../../../services/lookup.service';

import { GroupType } from '../../../models/group-type';

@Component({
  selector: 'group-type',
  templateUrl: 'group-type.component.html'
})

export class GroupTypeComponent implements OnInit {

  private groupTypes: GroupType[];
  private isAllDataLoaded: boolean = false;

  constructor( private lookupService: LookupService,
               private filterService: FilterService) { }

  public ngOnInit(): void {
    this.getGroupTypesFromMp();
  }

  public clickToSelect(value: string) {
    this.setGroupTypeSelection(value);
    this.setFilterStringInFilterService();
  }

  public reset() {
    for (let groupType of this.groupTypes) {
      groupType.selected = false;
    }
  }

  private getGroupTypesFromMp(): void {
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

  private setGroupTypeSelection(selectedValue: string) {
    this.reset();
    let group = this.groupTypes.find(i => i.attribute.name === selectedValue);
    if ( group != null) {
      group.selected = !group.selected;
    }
  }

  private setFilterStringInFilterService(): void {
    this.filterService.setFilterStringGroupTypes(this.groupTypes);
  }

}
