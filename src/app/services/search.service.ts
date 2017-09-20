import { Injectable } from '@angular/core';

import { AppSettingsService } from '../services/app-settings.service';
import { StateService } from '../services/state.service';

import { Pin } from '../models/pin';

import { ViewType } from '../shared/constants'

@Injectable()
export class SearchService {

  constructor(
    private appSettings: AppSettingsService,
    private state: StateService,
  ) {}

  public navigateToListViewIfInGroupToolAndAllGroupsOnline(pinsReturnedBySearch: Pin[]) {
    if(this.appSettings.isSmallGroupApp && this.areAllReturnedGroupsOnlineGroups(pinsReturnedBySearch)){
      this.state.setCurrentView(ViewType.LIST);
    }
  }

  public areAllReturnedGroupsOnlineGroups(pinsReturnedBySearch: Pin[]): boolean {
    let areAllGroupsOnline: boolean = pinsReturnedBySearch.every(pin => pin.gathering.isVirtualGroup === true);
    return areAllGroupsOnline;
  }

}
