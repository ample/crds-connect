import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Component, ViewEncapsulation, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { Angulartics2GoogleTagManager, Angulartics2GoogleAnalytics} from 'angulartics2';

import { ToastModule, ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';

import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { StateService } from './services/state.service';
import { AppSettingsService } from './services/app-settings.service';
import { AppType } from './shared/constants';

@Component({
  selector: 'app-root',
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
  template: `
    <div [ngClass]="{'loading': state.is_loading}">
      <app-preloader></app-preloader>
      <div class="outlet-wrapper connect-bg">
        <app-header></app-header>
        <router-outlet></router-outlet>
      </div>
    </div>`,
  styleUrls: ['../styles/application.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {
  action: string;
  type: string;
  params: any;
  iFrameResizerCW: any;

  constructor(
    private location: Location,
    private appsettings: AppSettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private angulartics2GoogleTagManager: Angulartics2GoogleTagManager,
    private state: StateService,
    private content: ContentService,
    public toastr: ToastsManager,
    public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    vRef: ViewContainerRef) {

    if ( this.iFrameResizerCW === undefined ) {
      this.iFrameResizerCW = require('iframe-resizer/js/iframeResizer.contentWindow.js');
      this.toastr.setRootViewContainerRef(vRef);
    }

    router.events.subscribe((val) => {
      this.removeFauxdalClasses(val);
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
  }

  ngOnInit() {
    this.state.setLoading(true);
    this.getAppContext();
  }

  private getAppContext() {

    let root = document.location.href.replace(this.location.path(), '');

    let url: string = document.location.href;

    let isInConnectApp: boolean = this.isInSpecifiedApp('connect', root, url);
    let isInGroupsApp: boolean = this.isInSpecifiedApp('groupsv2', root, url);

    if (isInConnectApp) {
      this.appsettings.setAppSettings(AppType.Connect);
    } else if (isInGroupsApp) {
      this.appsettings.setAppSettings(AppType.Groups);
    } else {
      this.defaultToGroupAppType();
    }
    // this.appsettings.setAppSettings(AppType.Groups);

  }

  public isInSpecifiedApp(appRoute: string, root: string, url: string) {
    let rootEndsWithAppRoute: boolean = root.endsWith(appRoute) || root.endsWith(appRoute + '/');
    let urlEndsWithAppRoute: boolean = url.endsWith(appRoute) || url.endsWith(appRoute + '/');
    let isInConnectApp: boolean = rootEndsWithAppRoute || urlEndsWithAppRoute;
    return isInConnectApp;
  }

  removeFauxdalClasses(val) {
    if (val.constructor.name === 'NavigationStart') {
      // Remove the .fauxdal-open selector from <body> element whenever the router emits a path change
      document.querySelector('body').classList.remove('fauxdal-open');
    }
  }

  private defaultToGroupAppType(): void {
    this.appsettings.setAppSettings(AppType.Groups);
  }

}
