import { EventEmitter, Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs/Rx';

import { Address } from '../models/address';
import { MapView } from '../models/map-view';
import { PinIdentifier } from '../models/pin-identifier';
import { Pin, pinType } from '../models/pin';
import { PinSearchResultsDto } from '../models/pin-search-results-dto';
import { SearchOptions } from '../models/search-options';

import { ViewType } from '../shared/constants';

// TODO: This class has a lot of flags.
// Investigate to see if they belong here and/or add some documentation.
@Injectable()
export class StateService {

  public myStuffStateChangedEmitter: Subject<boolean> = new Subject<boolean>();

  public appForWhichWeRanLastSearch: string = undefined;
  public deletedPinIdentifier: PinIdentifier = null;
  public hasBrandBar: boolean = true;
  public hasPageHeader: boolean = false;
  public is_loading: boolean = false;
  public isFilterDialogOpen: boolean = false;
  public isFilterActive: boolean = false;
  public lastSearch: SearchOptions;
  private lastSearchResults: PinSearchResultsDto;
  public myStuffActive: boolean = false;
  public navigatedBackToNeighbors: boolean = false;
  // TODO: Rename. Perhaps shouldReplaceAwsPin. It is nice when booleans are predicates.
  public navigatedFromAddToMapComponent: boolean = false;
  public pageHeader: Object = { routerLink: null, title: null };
  public postedPin: Pin;
  public removedSelf: boolean = false;
  private savedMapView: MapView;
  public searchBarText: string;
  public updatedPinOldAddress: Address;
  public updatedPin: Pin;
  private activeGroupPath: string;

  private mapOrListView: ViewType = ViewType.MAP;
  public viewButtonText: string = 'List';
  private showingPinCount: number = 10;
  // values of 'my' or 'world' ('my' is used for 'My Stuff' view)
  private myViewOrWorldView: string = 'world';
  private zoomToUse: number = -1;


  constructor() {
    this.lastSearch = new SearchOptions('', '', '');
  }

  public emitMyStuffChanged(): void {
    this.myStuffStateChangedEmitter.next(this.myStuffActive);
  }

  public setIsMyStuffActive(isActive: boolean) {
    this.myStuffActive = isActive;
    this.myViewOrWorldView = 'my';
    this.emitMyStuffChanged();
  }

  public isMapViewSet(): boolean {
    return this.savedMapView != null;
  }

  public setMapView(mv: MapView) {
    if ( this.isMapViewSet() && mv.lat === 0 && mv.lng === 0) {
      mv.lat = this.savedMapView.lat;
      mv.lng = this.savedMapView.lng;
    }
    this.savedMapView = mv;
  }

  public getMapView(): MapView {
    return this.savedMapView;
  }


  public setActiveGroupPath(path: string): void {
    this.activeGroupPath = path;
  }

  public getActiveGroupPath(): string {
    return this.activeGroupPath;
  }

  public setIsFilterDialogOpen(val: boolean): void {
    this.isFilterDialogOpen = val;
  }

  public getIsFilteredDialogOpen(): boolean {
    return this.isFilterDialogOpen;
  }

  public getLastSearch(): SearchOptions {
    return this.lastSearch;
  }

  public setLastSearch(ls: SearchOptions): void {
    this.lastSearch = ls;
  }

  public getlastSearchResults(): PinSearchResultsDto {
    return this.lastSearchResults;
  }

  public setlastSearchResults(searchResults: PinSearchResultsDto): void {
    this.lastSearchResults = searchResults;
  }

  public setLastSearchSearchString(value: string): void {
    this.lastSearch.search = value;
  }

  public setLoading(val: boolean): void {
    this.is_loading = val;
  }

  public setCurrentView(view: ViewType): void {
    this.mapOrListView = view;
    this.viewButtonText = view === ViewType.MAP ? 'List' : 'Map';
  }

  public getCurrentView(): ViewType {
    return this.mapOrListView;
  }

  // values of 'my' or 'world' ('my' is used for 'My Stuff' view)
  public setMyViewOrWorldView(view: string): void {
    this.myViewOrWorldView = view;
  }

  public getMyViewOrWorldView(): string {
    return this.myViewOrWorldView;
  }

  public setShowingPinCount(count: number) {
    this.showingPinCount = count;
  }

  public getShowingPinCount(): number {
    return this.showingPinCount;
  }

  public setPageHeader(title, routerLink): void {
    this.hasPageHeader = true;
    this.pageHeader['title'] = title;
    this.pageHeader['routerLink'] = routerLink;
  }

  public setUseZoom(zoom: number): void {
    this.zoomToUse = zoom;
  }

  public getUseZoom(): number {
    return this.zoomToUse;
  }

  public cleanUpStateAfterPinUpdate(): void {
    this.navigatedFromAddToMapComponent = false;
    this.updatedPinOldAddress = null;
    this.updatedPin = null;
  }

  public clearLastSearch(): void {
    this.lastSearch = new SearchOptions('', '', '');
    this.searchBarText = '';
  }

  public setDeletedPinIdentifier(pinContactId: number, pinType: pinType): void {
    let pinIdentifier: PinIdentifier = new PinIdentifier(pinType, pinContactId);
    this.deletedPinIdentifier = pinIdentifier;
  }

  public getDeletedPinIdentifier(): PinIdentifier {
    return this.deletedPinIdentifier;
  }
}
