import { Component, CUSTOM_ELEMENTS_SCHEMA, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { FormsModule }   from '@angular/forms';
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
  public buttontext: string;

  constructor() {
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
    if (searchString !== null && searchString.length > 0) {
      this.search.emit(this.searchText);
      this.searchText = '';
    }
  }

  private setButtonText() {
    this.buttontext = this.mapViewActive ? 'List' : 'Map';
  }

}
