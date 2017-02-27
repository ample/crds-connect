import { Component, CUSTOM_ELEMENTS_SCHEMA, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: 'search-bar.component.html',
  styleUrls: ['search-bar.component.css']
})
export class SearchBarComponent {
  @Output()  viewMap: EventEmitter<boolean>  = new EventEmitter<boolean>();

  public mapViewActive: boolean = true;

  constructor( ) {}

  public toggleView() {
    this.mapViewActive = !this.mapViewActive;
    this.viewMap.emit(this.mapViewActive);
  }

}
