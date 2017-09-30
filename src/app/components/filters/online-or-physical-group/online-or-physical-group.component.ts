import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';

import { FilterService } from '../../../services/filter.service';
import { StateService } from '../../../services/state.service';
import { ViewType } from '../../../shared/constants';

@Component({
  selector: 'online-or-physical-group',
  templateUrl: 'online-or-physical-group.component.html'
})

export class OnlineOrPhysicalGroupComponent implements OnInit {
  private isVirtualGroup: boolean = null;
  public isAnOptionSelected: boolean = false;

  constructor( private filterService: FilterService, private stateService: StateService) { }

  public ngOnInit() {
    this.setSelectedFilter();
  }

  public setSelectedFilter(): void {
    const filter = this.filterService.getSelectedGroupLocation();
    if (filter) {
      this.isAnOptionSelected = true;
      if (+filter === 0) {
        this.isVirtualGroup = false;
      } else {
        this.isVirtualGroup = true;
        this.stateService.setCurrentView(ViewType.LIST);
      }
      this.setFilterString(this.isVirtualGroup);
    }
  }

  public isVirtualGroupOptionClicked(isVirtualGroup: boolean): void {
    this.isAnOptionSelected = true;
    this.isVirtualGroup = isVirtualGroup;
    this.setFilterString(this.isVirtualGroup);
  }

  public reset(): void {
    this.isVirtualGroup = null;
    this.isAnOptionSelected = false;
  }

  private setFilterString(isVirtualGroup: boolean): void {
    const isVirtualGroupFlag = isVirtualGroup ? 1 : 0;
    const haveIsVirtualGroupValue = this.isVirtualGroup !== null || this.isVirtualGroup !== undefined;
    this.filterService.setFilterStringIsVirtualGroup(isVirtualGroupFlag, haveIsVirtualGroupValue);
  }

  public setIsVirtualGroup(isVirtualGroup: boolean): void {
    this.isVirtualGroup = isVirtualGroup;
  }

  public getIsVirtualGroup(): boolean {
    return this.isVirtualGroup;
  }
}
