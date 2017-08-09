import { EventEmitter, Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs/Rx';

import { Address } from '../models/address';
import { MapView } from '../models/map-view';
import { PinIdentifier } from '../models/pin-identifier';
import { Pin, pinType } from '../models/pin';
import { PinSearchResultsDto } from '../models/pin-search-results-dto';
import { SearchOptions } from '../models/search-options';

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

  private mapOrListView: string = 'map';
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

  public setIsFilterDialogOpen(val: boolean) {
    this.isFilterDialogOpen = val;
  }

  public getIsFilteredDialogOpen() {
    return this.isFilterDialogOpen;
  }

  public getLastSearch() {
    return this.lastSearch;
  }

  public setLastSearch(ls: SearchOptions) {
    this.lastSearch = ls;
  }

  public getlastSearchResults(): PinSearchResultsDto {
    return this.lastSearchResults;
  }

  public setlastSearchResults(searchResults: PinSearchResultsDto): void {
    this.lastSearchResults = searchResults;
  }

  public setLastSearchSearchString(value: string) {
    this.lastSearch.search = value;
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

  public clearLastSearch() {
    this.lastSearch = new SearchOptions('', '', '');
    this.searchBarText = '';
  }

  public setDeletedPinIdentifier(pinContactId: number, pinType: pinType): void {
    let pinIdentifier: PinIdentifier = new PinIdentifier(pinType, pinContactId);
    this.deletedPinIdentifier = pinIdentifier;
  }

  public getDeletedPinIdentifier(): PinIdentifier{
    return this.deletedPinIdentifier;
  }
}
