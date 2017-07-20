import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { AppSettingsService } from '../../services/app-settings.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  constructor(private appSettings: AppSettingsService,
              private state: StateService,
              private router: Router) {
    this.listenForRouteChange();
  }

  private listenForRouteChange() {
    this.router.events.subscribe((val) => {
        if (val instanceof NavigationStart) {
          this.state.hasPageHeader = false;
        }
    });
  }

}
