import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';

import { FilterService } from '../../../services/filter.service';
import { LookupService } from '../../../services/lookup.service';

import { GroupType } from '../../../models/group-type';

@Component({
  selector: 'group-type',
  templateUrl: 'group-type.component.html'
})
export class GroupTypeComponent implements OnInit {
  private groupTypes: GroupType[];
  public isAllDataLoaded: boolean = false;

  constructor( private lookupService: LookupService,
               private filterService: FilterService) { }

  public ngOnInit(): void {
    this.getGroupTypesFromMpAndInit();
  }

  public onGroupTypeClicked(groupTypeName: string) {
    this.setGroupTypeSelection(groupTypeName);
    this.setFilterStringInFilterService();
  }

  public reset() {
    for (let groupType of this.groupTypes) {
      groupType.selected = false;
    }
  }

  private getGroupTypesFromMpAndInit(): void {
    this.lookupService.getGroupGenderMixTypes().subscribe(
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

  private setGroupTypeSelection(selectedGroupName: string) {
    this.reset();
    let group: GroupType = this.groupTypes.find(i => i.attribute.name === selectedGroupName);
    if ( group != null) {
      group.selected = !group.selected;
    }
  }

  private setFilterStringInFilterService(): void {
    this.filterService.setFilterStringGroupTypes(this.groupTypes);
  }

}
