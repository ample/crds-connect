import { Injectable} from '@angular/core';
import { AppType, LeadershipApplicationType } from '../shared/constants';

@Injectable()
export class AppSettingsService {
  public finderType: AppType;
  public leadershipApplicationType: LeadershipApplicationType;
  public appRoute: string;

  constructor() {}

  setAppSettings(appType: AppType) {
    this.finderType = appType;
    switch (this.finderType) {
      case AppType.Connect:
        this.leadershipApplicationType = LeadershipApplicationType.ANYWHERE_HOST;
        this.appRoute = '/';
        break;
      case AppType.Groups:
        this.leadershipApplicationType = LeadershipApplicationType.GROUP_LEADER;
        this.appRoute = '/groupsv2';
        break;
    }
  }

  public isConnectApp(): boolean {
    return this.finderType === AppType.Connect;
  }

  public isSmallGroupApp(): boolean {
    return this.finderType === AppType.Groups;
  }

  public getBaseUrlForCurrentApp(): string {
    return this.appRoute;
  }
}
