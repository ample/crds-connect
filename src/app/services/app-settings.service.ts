import { Injectable} from '@angular/core';
import { AppType, appType, LeadershipApplicationType } from '../shared/constants';

@Injectable()
export class AppSettingsService {
  public finderType: string;
  public leadershipApplicationType: LeadershipApplicationType;
  public appRoute: string;
  public placeholderTextForSearchBar: string;
  public myStuffName: string;
  public noSearchResultsContent: string;
  public myStuffNotFoundContent: string;
  public leaderTitle: string;

  constructor() {}

  public setAppSettings (thisAppsType: string) {
    this.finderType = thisAppsType;
    switch (this.finderType) {
      case appType.Connect:
        this.leadershipApplicationType = LeadershipApplicationType.ANYWHERE_HOST;
        this.appRoute = '/';
        this.placeholderTextForSearchBar = 'Address...';
        this.myStuffName = 'My connections';
        this.noSearchResultsContent = 'noConnectSearchResults';
        this.myStuffNotFoundContent = 'myConnectionsNotFound';
        this.leaderTitle = 'Host';
        break;
      case appType.Groups:
        this.leadershipApplicationType = LeadershipApplicationType.GROUP_LEADER;
        this.appRoute = '/groupsv2';
        this.placeholderTextForSearchBar = 'Keyword...';
        this.myStuffName = 'My groups';
        this.noSearchResultsContent = 'noGroupsSearchResults';
        this.myStuffNotFoundContent = 'myGroupsNotFound';
        this.leaderTitle = 'Leader';
        break;
    }
  }

  public isConnectApp(): boolean {
    return this.finderType === appType.Connect;
  }

  public isSmallGroupApp(): boolean {
    return this.finderType === appType.Groups;
  }

  public getBaseUrlForCurrentApp(): string {
    return this.appRoute;
  }
}
