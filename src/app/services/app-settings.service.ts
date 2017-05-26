import { Injectable} from '@angular/core';
import { AppType, app, AppRoute, appRoute } from '../shared/constants';

@Injectable()
export class AppSettingsService {

  public finderType: string;

  constructor() {}

  setAppSettings(appType: AppType) {
      switch (appType) {
          case AppType.Connect:
            this.finderType = app.CONNECT;
            console.log('Settings for Connect');
            break;
          case AppType.Groups:
            this.finderType = app.SMALL_GROUPS;
            console.log('Settings for Groups');
            break;
      }
  }

  public isConnectApp(): boolean {
      let isConnectApp: boolean = this.finderType === app.CONNECT;
      return isConnectApp;
  }

  public getBaseUrlForCurrentApp(): string {
      let baseUrlForApp: string = this.isConnectApp() ? appRoute.CONNECT_ROUTE : appRoute.SMALL_GROUPS_ROUTE;
      return baseUrlForApp;
  }

}
