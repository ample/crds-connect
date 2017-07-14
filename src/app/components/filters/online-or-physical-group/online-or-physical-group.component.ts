import { Angulartics2 } from 'angulartics2';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { AppSettingsService } from '../../../services/app-settings.service';
import { FilterService } from '../../../services/filter.service';
import { Pin, pinType } from '../../../models/pin';
import { awsFieldNames } from '../../../shared/constants';

@Component({
  selector: 'online-or-physical-group',
  templateUrl: 'online-or-physical-group.component.html'
})

export class OnlineOrPhysicalGroupComponent {
  public isVirtualGroup: boolean = null;
  public selected: boolean = false;

  constructor( private appSettings: AppSettingsService,
               private filterService: FilterService) { }


  public isVirtualGroupOptionClicked(isVirtualGroup: boolean): void {
    this.selected = true;
    this.isVirtualGroup = isVirtualGroup;
    this.setFilterString(this.isVirtualGroup);
  }

  private setFilterString(isVirtualGroup: boolean): void {
    let isVirtualGroupFlag = isVirtualGroup ? 1 : 0;
    let haveIsVirtualGroupValue = this.isVirtualGroup != null || this.isVirtualGroup !== undefined;
    this.filterService.setFilterStringIsVirtualGroup(isVirtualGroupFlag, haveIsVirtualGroupValue);
  }

  public reset() {
    this.isVirtualGroup = null;
    this.selected = false;
  }
}
