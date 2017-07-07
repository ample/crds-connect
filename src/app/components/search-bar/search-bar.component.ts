import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { Router } from '@angular/router';

import { Angulartics2 } from 'angulartics2';
import { Observable, Subscription } from 'rxjs/Rx';

import { GeoCoordinates } from '../../models/geo-coordinates';
import { Pin } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';
import { PinSearchRequestParams } from '../../models/pin-search-request-params';

import { AppSettingsService } from '../../services/app-settings.service';
import { FilterService } from '../../services/filter.service';
import { PinService } from '../../services/pin.service';
import { StateService } from '../../services/state.service';

import { app, placeholderTextForSearchBar } from '../../shared/constants';

@Component({
  selector: 'app-search-bar',
  templateUrl: 'search-bar.component.html',
  styleUrls: ['search-bar.component.css']
})
export class SearchBarComponent implements OnChanges, OnInit {
  @Input() isMapHidden: boolean;
  @Input() isMyStuffSearch: boolean;
  @Output() viewMap: EventEmitter<boolean>  = new EventEmitter<boolean>();

  private isMyStuffActiveSub: Subscription;
  public buttontext: string;
  public isSearchClearHidden: boolean = true;
  public placeholderTextForSearchBar: string;
  public searchString: string;

  constructor(private appSettings: AppSettingsService,
              private pinService: PinService,
              private state: StateService,
              private filterService: FilterService) {
  }

  public ngOnInit(): void {

    this.placeholderTextForSearchBar = this.appSettings.isConnectApp() ? placeholderTextForSearchBar.ADDRESS :
                                                                         placeholderTextForSearchBar.KEYWORD;

    this.isMyStuffActiveSub = this.state.myStuffStateChangedEmitter.subscribe((isMyStuffActive) => {
      this.isMyStuffSearch = isMyStuffActive;
      this.setButtonText();
      this.setSearchText();
    });
  }

  public ngOnChanges(): void {
    this.setButtonText();
    this.setSearchText();
  }

  public toggleView() {
    this.isMapHidden = !this.isMapHidden;
    this.viewMap.emit(!this.isMapHidden);

    if (this.state.searchBarText && this.state.searchBarText.length > 0 && this.state.searchBarText !== 'My Stuff') {
      this.onSearch(this.state.searchBarText);
    }

    this.setButtonText();
  }

  public onSearch(searchString: string) {
console.log('AM I HERE????? search bar');
    this.searchString = searchString;
    this.state.myStuffActive = false;
    this.state.setMyViewOrWorldView('world');
    this.state.setIsFilterDialogOpen(false);
    let filterString: string = this.filterService.buildFilters();
console.log(filterString);
console.log(searchString);
    if ((searchString !== undefined && searchString !== null && searchString.length > 0) || filterString != null) {
console.log('AM I HERE---- NOW    search bar ?????');
      let isThisALocationBasedSearch: boolean = this.appSettings.isConnectApp();
      let pinSearchRequest = new PinSearchRequestParams(isThisALocationBasedSearch, searchString, filterString);
      this.state.lastSearch.search = searchString;
      this.pinService.emitPinSearchRequest(pinSearchRequest);
    }
  }

  private setButtonText() {
    this.buttontext = this.isMapHidden ? 'Map' : 'List';
  }

  private setSearchText() {
    if (!this.state.myStuffActive) {
      this.state.searchBarText = (this.state.lastSearch && this.state.lastSearch.search !== 'useLatLng')
                        ? this.state.lastSearch.search : '';
    } else {
      this.state.searchBarText = 'My Stuff';
    }
  }

  public clearSearchText() {
    this.state.searchBarText = '';
  }

  public resetSearchInput(event) {
    event.preventDefault();
    this.clearSearchText();
    this.focusSearchInput();
  }

  public searchKeyUp() {
    this.isSearchClearHidden = false;
  }

  public focusSearchInput() {
    document.getElementById('search-bar-input').focus();
  }

  public toggleFilters() {
    this.state.setIsFilterDialogOpen(!this.state.getIsFilteredDialogOpen());
  }

}
