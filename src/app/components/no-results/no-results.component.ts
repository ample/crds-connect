import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppSettingsService } from '../../services/app-settings.service';
import { StateService } from '../../services/state.service';
import { ViewType } from '../../shared/constants';

@Component({
  templateUrl: 'no-results.component.html'
})

export class NoResultsComponent implements OnInit {
  private groupUrl: string;
  private isConnect: boolean = false;

  constructor(private router: Router,
              private state: StateService,
              private appSettings: AppSettingsService) {}

  public ngOnInit(): void {
    this.state.clearLastSearch();
    this.state.navigatedBackToNeighbors = true;
    this.groupUrl = `//${process.env.CRDS_ENV || 'www'}.crossroads.net/groups/search`;
    this.state.setPageHeader('No Results', '/');
    this.state.myStuffActive = false;
    this.state.setLoading(false);
    this.isConnect = this.appSettings.isConnectApp();
  }

  public btnClickBack()  {
    this.router.navigateByUrl('/');
  }

  public btnClickAddToMap() {
    this.router.navigateByUrl('/add-me-to-the-map');
  }

  public btnClickBecomeHost() {
    this.router.navigateByUrl('/host-signup');
  }

  public btnClickFindOnlineGroup()  {
    window.open(this.groupUrl);
  }

  public btnCreateGroup() {
    this.state.setCurrentView(ViewType.LIST);
    this.router.navigateByUrl('/create-group');
  }

}
