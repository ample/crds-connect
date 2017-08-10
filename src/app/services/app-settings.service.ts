import { Injectable} from '@angular/core';
import { AppType, appType, LeadershipApplicationType, textConstants } from '../shared/constants';
import { appRoutingProviders, routing } from '../app.routing';
import { StuffNotFoundComponent } from '../components/stuff-not-found/stuff-not-found.component';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  public setAppSettings (thisAppsType: string) {
    this.finderType = thisAppsType;
    switch (this.finderType) {
      case appType.Connect:
        this.leadershipApplicationType = LeadershipApplicationType.ANYWHERE_HOST;
        this.appRoute = '/';
        this.placeholderTextForSearchBar = 'Address...';
        this.myStuffName = textConstants.MY_CONNECTIONS;
        this.noSearchResultsContent = 'noConnectSearchResults';
        this.myStuffNotFoundContent = 'myConnectionsNotFound';
        this.leaderTitle = 'Host';
        break;
      case appType.Groups:
        this.leadershipApplicationType = LeadershipApplicationType.GROUP_LEADER;
        this.appRoute = '/groupsv2';
        this.placeholderTextForSearchBar = 'Keyword...';
        this.myStuffName = textConstants.MY_GROUPS;
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

  public routeToNotFoundPage(): void {
    if(this.finderType === appType.Groups){
      this.router.navigate(['groups-not-found']);
    } else {
      this.router.navigate(['connections-not-found']);
    } 
   }

  public appClass(): string {
    return this.isConnectApp() ? 'connect' : 'groups';
  }
}
