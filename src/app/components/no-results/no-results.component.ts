import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppSettingsService } from '../../services/app-settings.service';
import { StateService } from '../../services/state.service';

@Component({
  templateUrl: 'no-results.component.html'
})

export class NoResultsComponent implements OnInit {
  private groupUrl: string;

  constructor(private router: Router,
              private state: StateService,
              private appSettings: AppSettingsService) {}

  public ngOnInit(): void {
    this.state.setLoading(false);
    this.state.clearLastSearch();
    this.state.navigatedBackToNeighbors = true;
    this.groupUrl = `//${process.env.CRDS_ENV || 'www'}.crossroads.net/groups/search`;
    this.state.setPageHeader('No Results', '/');
    this.state.myStuffActive = false;
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

}
