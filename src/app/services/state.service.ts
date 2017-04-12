import { Injectable } from '@angular/core';
import { MapView } from '../models/map-view';
import { Pin } from '../models/pin';
import { SearchOptions } from '../models/search-options';

@Injectable()
export class StateService {

  public hasBrandBar: boolean = true;
  public hasPageHeader: boolean = false;
  public pageHeader: Object = { routerLink: null, title: null };
  public is_loading: boolean = false;
  public navigatedBackFromAuthComponent: boolean = false;
  public navigatedFromAddToMapComponent: boolean = false;

  public myStuffActive: boolean = false;
  private mapOrListView: string = 'map';
  public postedPin: Pin;
  private showingPinCount: number = 10;
  // values of 'my' or 'world' ('my' is used for 'My Stuff' view)
  private myViewOrWorldView: string = 'world';
  private zoomToUse: number = -1;
  private savedMapView: MapView;
  private lastSearch: SearchOptions;

  public setMapView(mv: MapView) {
    this.savedMapView = mv;
  }

  public getMapView() {
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

}
