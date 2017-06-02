import { Angulartics2 } from 'angulartics2';

import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { GeoCoordinates } from '../../models/geo-coordinates';
import { Pin } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: 'search-bar.component.html',
  styleUrls:  ['search-bar.component.css']
})
export class SearchBarComponent implements OnChanges {
  @Input() isMapHidden: boolean;
  @Input() isMyStuffSearch: boolean;
  @Output() viewMap: EventEmitter<boolean>  = new EventEmitter<boolean>();
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  private searchText: string = '';
  public buttontext: string;
  public isSearchClearHidden: boolean = true;

  constructor(private state: StateService) {}

  public ngOnInit(): void {
    if (!this.state.myStuffActive) {
      this.searchText = this.state.lastSearch ? this.state.lastSearch.search : '';
    } else {
      this.searchText = 'My Stuff';
    }
  }

  public ngOnChanges(): void {
    this.setButtonText();
    this.setSearchText();
  }

  public toggleView() {
    this.isMapHidden = !this.isMapHidden;
    this.viewMap.emit(!this.isMapHidden);

    if (this.searchText.length > 0) {
      this.onSearch(this.searchText);
    }

    this.setButtonText();
  }

  public onSearch(searchString: string) {
    this.state.myStuffActive = false;
    this.state.setMyViewOrWorldView('world');
    if (searchString !== null && searchString.length > 0) {
      this.search.emit(searchString);
    }
  }

  private setButtonText() {
    this.buttontext = this.isMapHidden ? 'Map' : 'List';
  }

  private setSearchText() {
    this.searchText = this.isMyStuffSearch ? 'My Stuff' : '';
  }

  public clearSearchText() {
    this.searchText = '';
  }

  public searchKeyUp(){
    this.isSearchClearHidden = false;
  }

}
