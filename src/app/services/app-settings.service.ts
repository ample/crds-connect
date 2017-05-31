import { Injectable} from '@angular/core';
import { AppType, app, AppRoute, appRoute, LeadershipApplicationType } from '../shared/constants';

@Injectable()
export class AppSettingsService {

  public finderType: string;
  public leadershipApplicationType: LeadershipApplicationType;

  constructor() {}

  setAppSettings(appType: AppType) {
      switch (appType) {
          case AppType.Connect:
            this.finderType = app.CONNECT;
            this.leadershipApplicationType = LeadershipApplicationType.ANYWHERE_HOST;
            break;
          case AppType.Groups:
            this.finderType = app.SMALL_GROUPS;
            this.leadershipApplicationType = LeadershipApplicationType.GROUP_LEADER;
            break;
      }
  }

  public isConnectApp(): boolean {
      let isConnectApp: boolean = this.finderType === app.CONNECT;
      return isConnectApp;
  }

  public isSmallGroupApp(): boolean {
    let isSmallGroupApp: boolean = this.finderType === app.SMALL_GROUPS;
    return isSmallGroupApp;
  }

  public getBaseUrlForCurrentApp(): string {
      let baseUrlForApp: string = this.isConnectApp() ? appRoute.CONNECT_ROUTE : appRoute.SMALL_GROUPS_ROUTE;
      return baseUrlForApp;
  }

}
