import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';

import { AppSettingsService } from '../../services/app-settings.service';
import { locationBackText } from '../../shared/constants';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  constructor(public appSettings: AppSettingsService,
    private router: Router,
    public state: StateService,
    private location: Location) {
    this.listenForRouteChange();
  }

  public changeRoute(route: string) {
    if (route === locationBackText) {
      this.location.back();
    } else {
      this.router.navigate([route]);
    }
  }

  private listenForRouteChange() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationStart) {
        this.state.hasPageHeader = false;
      }
    });
  }

}
