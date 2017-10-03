import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs/Rx';

import { GeoCoordinates } from '../../models/geo-coordinates';
import { Pin } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';
import { PinSearchRequestParams } from '../../models/pin-search-request-params';

import { textConstants } from '../../shared/constants';

import { AppSettingsService } from '../../services/app-settings.service';
import { FilterService } from '../../services/filter.service';
import { PinService } from '../../services/pin.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: 'search-bar.component.html',
  styleUrls: ['search-bar.component.scss']
})
export class SearchBarComponent implements OnChanges, OnInit {
  @Input() isMapHidden: boolean;
  @Input() isMyStuffSearch: boolean;
  @Output() viewMap: EventEmitter<boolean>  = new EventEmitter<boolean>();

  private isMyStuffActiveSub: Subscription;
  public isSearchClearHidden: boolean = true;
  public placeholderTextForSearchBar: string;

  constructor(public appSettings: AppSettingsService,
              private pinService: PinService,
              public state: StateService,
              private filterService: FilterService) {
  }

  public ngOnInit(): void {
    this.placeholderTextForSearchBar = this.appSettings.placeholderTextForSearchBar;

    this.isSearchClearHidden = !this.state.searchBarText || this.state.searchBarText === '';

    this.isMyStuffActiveSub = this.state.myStuffStateChangedEmitter.subscribe((isMyStuffActive) => {
      this.isMyStuffSearch = isMyStuffActive;
      this.setSearchText();
    });
  }

  public ngOnChanges(): void {
    this.setSearchText();
  }

  public toggleView(): void {
    this.isMapHidden = !this.isMapHidden;
    this.viewMap.emit();

    // Perform a search unless the search bar is blank or we are viewing My Stuff:
    if (this.state.searchBarText && this.state.searchBarText.length > 0 && this.state.searchBarText !== this.appSettings.myStuffName) {
      this.onSearch(this.state.searchBarText);
    }
  }

  public onSearch(search: string): void {
    this.state.myStuffActive = false;
    this.state.setMyViewOrWorldView('world');
    this.state.setIsFilterDialogOpen(false);
    this.state.searchBarText = search;

    search = search.replace(/'/g, '%27');  // Escape single quotes in the search string

    // This needs to go away soon -- you can have location filter and keyword search in connect.
    let locationFilter = this.appSettings.isConnectApp() ? search : null;
    let keywordString = this.appSettings.isSmallGroupApp() ? search : null;
    let filterString: string = this.filterService.buildFilters();

    let pinSearchRequest = new PinSearchRequestParams(locationFilter, keywordString, filterString);
    this.state.lastSearch.search = search;
    this.pinService.emitPinSearchRequest(pinSearchRequest);
  }

  private setSearchText(): void {
    if (!this.state.myStuffActive) {
      this.state.searchBarText = (this.state.lastSearch && this.state.lastSearch.search !== 'useLatLng')
                        ? this.state.lastSearch.search : '';
    } else {
      this.state.searchBarText = this.appSettings.myStuffName;
    }
  }

  public clearSearchText(): void {
    this.state.searchBarText = '';
    this.onSearch('');
  }

  public resetSearchInput(event): void {
    event.preventDefault();
    this.clearSearchText();
    this.focusSearchInput();
  }

  public searchKeyUp(): void {
    this.isSearchClearHidden = false;
  }

  public focusSearchInput(): void {
    document.getElementById('search-bar-input').focus();
  }

  public toggleFilters(): void {
    this.state.setIsFilterDialogOpen(!this.state.getIsFilteredDialogOpen());
  }
}
