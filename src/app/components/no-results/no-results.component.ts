import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppSettingsService } from '../../services/app-settings.service';
import { StateService } from '../../services/state.service';
import { ViewType } from '../../shared/constants';
import { environment } from '../../../environments/environment';

@Component({
  templateUrl: 'no-results.component.html'
})

export class NoResultsComponent implements OnInit {
  public isConnect: boolean = false;
  private groupUrl: string;

  constructor(private router: Router,
              private state: StateService,
              public appSettings: AppSettingsService) {}

  public ngOnInit(): void {
    this.state.clearLastSearch();
    this.state.navigatedBackToNeighbors = true;
    this.groupUrl = `//${environment.CRDS_ENV || 'www'}.crossroads.net/groups/search`;
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
