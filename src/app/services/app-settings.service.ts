import { Injectable} from '@angular/core';
import { AppType, app, LeadershipApplicationType } from '../shared/constants';

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

}
