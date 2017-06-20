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
import { PinService } from '../../services/pin.service';
import { StateService } from '../../services/state.service';

import { app, placeholderTextForSearchBar } from '../../shared/constants';

@Component({
  selector: 'app-search-bar',
  templateUrl: 'search-bar.component.html',
  styleUrls:  ['search-bar.component.css']
})
export class SearchBarComponent implements OnChanges, OnInit {
  @Input() isMapHidden: boolean;
  @Input() isMyStuffSearch: boolean;
  @Output() viewMap: EventEmitter<boolean>  = new EventEmitter<boolean>();

  private isMyStuffActiveSub: Subscription;
  private searchText: string = '';
  public buttontext: string;
  public isSearchClearHidden: boolean = true;
  public placeholderTextForSearchBar: string;

  constructor(private appSettings: AppSettingsService,
              private pinService: PinService,
              private state: StateService) {
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

    if (this.searchText.length > 0 && this.searchText !== 'My Stuff') {
      this.onSearch(this.searchText);
    }

    this.setButtonText();
  }

  public onSearch(searchString: string) {
    this.state.myStuffActive = false;
    this.state.setMyViewOrWorldView('world');
    if (searchString !== null && searchString.length > 0) {
      let isThisALocationBasedSearch: boolean = this.appSettings.isConnectApp();
      let pinSearchRequest = new PinSearchRequestParams(isThisALocationBasedSearch, searchString);
      this.pinService.emitPinSearchRequest(pinSearchRequest);
    }
  }

  private setButtonText() {
    this.buttontext = this.isMapHidden ? 'Map' : 'List';
  }

  private setSearchText() {
    if (!this.state.myStuffActive) {
      this.searchText = (this.state.lastSearch && this.state.lastSearch.search !== 'useLatLng')
                        ? this.state.lastSearch.search : '';
    } else {
      this.searchText = 'My Stuff';
    }
  }

  public clearSearchText() {
    this.searchText = '';
  }

  public searchKeyUp() {
    this.isSearchClearHidden = false;
  }

}
