import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: 'search-bar.component.html',
  styleUrls: ['search-bar.component.css']
})
export class SearchBarComponent {
  @Input() buttontext;
  @Output() viewMap: EventEmitter<boolean>  = new EventEmitter<boolean>();
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  private mapViewActive: boolean = true;
  private searchText: string = '';

  constructor( ) {}

  public toggleView() {
    this.buttontext = 'toggle';
    this.mapViewActive = !this.mapViewActive;
    this.viewMap.emit(this.mapViewActive);

    if (this.searchText.length > 0) {
      this.onSearch(this.searchText);
    }
  }

  public onSearch(searchString: string) {
    this.search.emit(this.searchText);
    this.searchText = '';
  }

}
