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
  templateUrl: 'search-bar.component.html'
})
export class SearchBarComponent implements OnChanges {
  @Input() isMapHidden: boolean;
  @Output() viewMap: EventEmitter<boolean>  = new EventEmitter<boolean>();
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  private searchText: string = '';
  public buttontext: string;

  constructor(private state: StateService) {}

  public ngOnChanges(): void {
    this.setButtonText();
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
    this.state.setMyViewOrWorldView('world');
    if (searchString !== null && searchString.length > 0) {
      this.search.emit(searchString);
      this.searchText = '';
    }
  }

  private setButtonText() {
    this.buttontext = this.isMapHidden ? 'Map' : 'List';
  }

}
