import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { UserLocationService } from  '../../services/user-location.service';

import { GeoCoordinates } from '../../models/geo-coordinates';
import { Pin } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';

@Component({
  selector: 'app-search-bar',
  templateUrl: 'search-bar.component.html',
  styleUrls: ['search-bar.component.css']
})
export class SearchBarComponent  {
  @Output() viewMap: EventEmitter<boolean>  = new EventEmitter<boolean>();
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  private mapViewActive: boolean = true;
  private searchText: string = '';
  public pinSearchResults: PinSearchResultsDto;
  public buttontext: string;

  constructor(private userLocationService: UserLocationService) {
    this.setButtonText();
  }

  public toggleView() {
    this.mapViewActive = !this.mapViewActive;
    this.viewMap.emit(this.mapViewActive);

    if (this.searchText.length > 0) {
      this.onSearch(this.searchText);
    }

    this.setButtonText();
  }

  public onSearch(searchString: string) {
    this.search.emit(this.searchText);
    this.searchText = '';
    console.log(searchString);
  }

  private setButtonText() {
    this.buttontext = this.mapViewActive ? 'List' : 'Map';
  }

}
