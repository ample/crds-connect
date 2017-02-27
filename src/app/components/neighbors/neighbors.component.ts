import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-neighbors',
  templateUrl: 'neighbors.component.html'
})
export class NeighborsComponent {
 public mapViewActive: boolean = true;

  constructor( ) {}

  viewChanged(agreed: boolean) {
    this.mapViewActive = agreed;
  }

  doSearch(searchString: string) {
    console.log(searchString);
  }
}
