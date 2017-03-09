import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

@Component({
  selector: 'list-entry',
  templateUrl: 'list-entry.component.html'
})
export class ListEntryComponent {
  @Input() firstName: string = "";
  @Input() lastName: string = "";
  @Input() lat: number = 0;
  @Input() lng: number = 0;

  constructor() {}

}
