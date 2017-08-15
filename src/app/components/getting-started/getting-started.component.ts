import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PinService } from '../../services/pin.service';
import { StateService } from '../../services/state.service';
import { AppSettingsService } from '../../services/app-settings.service';

import { OnsiteGroupsUrl } from '../../shared/constants';


@Component({
  templateUrl: 'getting-started.component.html'
})
export class GettingStartedComponent implements OnInit {

  constructor(private router: Router,
             private state: StateService,
             private appSettings: AppSettingsService,
             private pinService: PinService) {}

  ngOnInit() {
    this.state.setPageHeader('Getting Started', '/');
    this.state.setLoading(false);
    return true;
  }

  public onClickOnsiteGroups(): void {
    window.location.href = OnsiteGroupsUrl;
  }

  public onClickOnFindAGroup(): void {
    this.pinService.clearPinCache();
    this.state.setIsMyStuffActive(false);
    this.state.setMyViewOrWorldView('world');
    this.router.navigate(['/']);
  }

}
