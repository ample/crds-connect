import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs/Rx';
import { LocationBarComponent } from './location-bar/location-bar.component';

import { GeoCoordinates } from '../../models/geo-coordinates';
import { Pin } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';
import { PinSearchRequestParams } from '../../models/pin-search-request-params';

import { textConstants } from '../../shared/constants';

import { AppSettingsService } from '../../services/app-settings.service';
import { FilterService } from '../filters/filter.service';
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
  @ViewChild(LocationBarComponent) public locationBarComponent: LocationBarComponent;

  private isMyStuffActiveSub: Subscription;
  public isSearchClearHidden: boolean = true;
  public placeholderTextForSearchBar: string;
  public isConnectApp: boolean;
  public shouldShowSubmit: boolean = false;

  constructor(private appSettings: AppSettingsService,
              private pinService: PinService,
              private state: StateService,
              private filterService: FilterService) {
  }

  public ngOnInit(): void {
    this.isConnectApp = this.appSettings.isConnectApp();
    this.placeholderTextForSearchBar = this.appSettings.placeholderTextForSearchBar;

    this.isSearchClearHidden = !this.state.searchBarText || this.state.searchBarText === '';

    this.isMyStuffActiveSub = this.state.myStuffStateChangedEmitter.subscribe((isMyStuffActive) => {
      this.isMyStuffSearch = isMyStuffActive;
      this.setSearchText();
    });

    this.clickListener();
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
    const locationFilter = this.appSettings.isConnectApp() ? search : this.locationBarComponent.location;
    const keywordString = this.appSettings.isSmallGroupApp() ? search : null;
    const filterString: string = this.filterService.buildFilters();

    const pinSearchRequest = new PinSearchRequestParams(locationFilter, keywordString, filterString);
    this.state.lastSearch.search = search;
    this.pinService.emitPinSearchRequest(pinSearchRequest);
    this.showLocationBar(false);
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
    this.showLocationBar(false);
  }

  public searchKeyUp(): void {
    this.isSearchClearHidden = false;
    if (!this.state.searchBarText) { this.isSearchClearHidden = true; }
  }

  public focusSearchInput(): void {
    document.getElementById('search-bar-input').focus();
  }

  public toggleFilters(): void {
    const shouldShowDialog = !this.state.getIsFilteredDialogOpen();
    this.state.setIsFilterDialogOpen(shouldShowDialog);
    if (this.shouldShowSubmit !== shouldShowDialog) {
      this.showLocationBar(shouldShowDialog);
    }
  }

  public showLocationBar(value): void {
    if (!this.isConnectApp) {
      this.shouldShowSubmit = value;
    }
  }

  private clickListener() {
    document.body.addEventListener('click', (event: any) => {
      if (!event.path) {
        return;
      }
      for (let i = 0; i < event.path.length; i++) {
        const classList = event.path[i].classList;
        if (classList && classList.contains('connect-search')) {
          return;
        }
      }
      this.showLocationBar(false);
    });
  }

  public filterCancel(): void {
    this.showLocationBar(false);
  }
}
