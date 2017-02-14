import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-add-me-to-map',
  templateUrl: 'add-me-to-map.component.html',
  styleUrls: ['add-me-to-map.component.css']
})
export class AddMeToMapMapComponent implements OnInit {

  constructor(private locationService: LocationService) { }

  public ngOnInit(): void {

  }


}

