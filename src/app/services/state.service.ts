import { EventEmitter, Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs/Rx';

import { Address } from '../models/address';
import { MapView } from '../models/map-view';
import { Pin, pinType } from '../models/pin';
import { SearchOptions } from '../models/search-options';

import { App, AppRoute, appRoute, app} from '../shared/constants';

// TODO: This class has a lot of flags. 
// Investigate to see if they belong here and/or add some documentation. 
@Injectable()
export class StateService {

  public myStuffStateChangedEmitter: Subject<boolean> = new Subject<boolean>();

  public activeApp: string = app.CONNECT;
  public appForWhichWeRanLastSearch: string = undefined;
  public hasBrandBar: boolean = true;
  public hasPageHeader: boolean = false;
  public pageHeader: Object = { routerLink: null, title: null };
  public is_loading: boolean = false;
  public navigatedBackToNeighbors: boolean = false;
  public navigatedDirectlyToGroup: boolean   = false; // Did we navigate directly to a group (group mode) because there was only one?

  // TODO: Rename. Perhaps shouldReplaceAwsPin. It is nice when booleans are predicates. 
  public navigatedFromAddToMapComponent: boolean = false;

  public myStuffActive: boolean = false;
  private mapOrListView: string = 'map';
  public postedPin: Pin;
  public updatedPinOldAddress: Address;
  public updatedPin: Pin;
  private showingPinCount: number = 10;
  // values of 'my' or 'world' ('my' is used for 'My Stuff' view)
  private myViewOrWorldView: string = 'world';
  private zoomToUse: number = -1;
  public savedMapView: MapView;
  public lastSearch: SearchOptions;

  public removedSelf: boolean = false;

  public emitMyStuffChanged(): void {
    this.myStuffStateChangedEmitter.next(this.myStuffActive);
  }

  public setIsMyStuffActive(isActive: boolean){
    this.myStuffActive = isActive;
    this.emitMyStuffChanged();
  }

  public setMapView(mv: MapView) {
    this.savedMapView = mv;
  }

  public getMapView(): MapView {
    return this.savedMapView;
  }

  public getLastSearch() {
    return this.lastSearch;
  }

  public setLastSearch(ls: SearchOptions) {
    this.lastSearch = ls;
  }

  public setLoading(val: boolean) {
    this.is_loading = val;
  }

  public setCurrentView(view: string) {
    this.mapOrListView = view;
  }

  public getCurrentView(): string {
    return this.mapOrListView;
  }

  // values of 'my' or 'world' ('my' is used for 'My Stuff' view)
  public setMyViewOrWorldView(view: string) {
    this.myViewOrWorldView = view;
  }

  public getMyViewOrWorldView(): string {
    return this.myViewOrWorldView;
  }

  public setShowingPinCount(count: number) {
    this.showingPinCount = count;
  }

  public getShowingPinCount() {
    return this.showingPinCount;
  }

  public setPageHeader(title, routerLink) {
    this.hasPageHeader = true;
    this.pageHeader['title'] = title;
    this.pageHeader['routerLink'] = routerLink;
  }

  public setUseZoom(zoom: number) {
    this.zoomToUse = zoom;
  }

  public getUseZoom() {
    return this.zoomToUse;
  }

  public cleanUpStateAfterPinUpdate() {
    this.navigatedFromAddToMapComponent = false;
    this.updatedPinOldAddress = null;
    this.updatedPin = null;
  }

  public setActiveApp(activeAppRoute: string): void {
    let isInGroupsApp: boolean = activeAppRoute === appRoute.SMALL_GROUPS_ROUTE;
    if (isInGroupsApp) {
      this.activeApp = app.SMALL_GROUPS;
    } else {
      this.activeApp = app.CONNECT;
    }
  }
}