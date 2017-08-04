import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';

import { FilterService } from '../../../services/filter.service';

@Component({
  selector: 'online-or-physical-group',
  templateUrl: 'online-or-physical-group.component.html'
})

export class OnlineOrPhysicalGroupComponent {
  public isVirtualGroup: boolean = null;
  public isAnOptionSelected: boolean = false;

  constructor( private filterService: FilterService) { }

  public isVirtualGroupOptionClicked(isVirtualGroup: boolean): void {
    this.isAnOptionSelected = true;
    this.isVirtualGroup = isVirtualGroup;
    this.setFilterString(this.isVirtualGroup);
  }

  public reset() {
    this.isVirtualGroup = null;
    this.isAnOptionSelected = false;
  }

  private setFilterString(isVirtualGroup: boolean): void {
    let isVirtualGroupFlag = isVirtualGroup ? 1 : 0;
    let haveIsVirtualGroupValue = this.isVirtualGroup !== null || this.isVirtualGroup !== undefined;
    this.filterService.setFilterStringIsVirtualGroup(isVirtualGroupFlag, haveIsVirtualGroupValue);
  }

}
