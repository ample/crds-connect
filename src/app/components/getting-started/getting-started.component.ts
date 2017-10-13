import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StateService } from '../../services/state.service';
import { AppSettingsService } from '../../services/app-settings.service';

import { OnsiteGroupsUrl } from '../../shared/constants';


@Component({
  templateUrl: 'getting-started.component.html'
})
export class GettingStartedComponent implements OnInit {

  constructor(private router: Router,
             public state: StateService,
             public appSettings: AppSettingsService) {}

  ngOnInit() {
    this.state.setPageHeader('Getting Started');
    this.state.setLoading(false);
    return true;
  }

  public onClickOnsiteGroups(): void {
    window.location.href = OnsiteGroupsUrl;
  }

}
