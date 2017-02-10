import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { crdsOakleyCoords } from '../shared/constants';
import { MapSettings } from '../models/map-settings';

@Component({
  selector: 'app-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.css']
})
export class MapComponent implements OnInit {

  public mapSettings: MapSettings  = new MapSettings(crdsOakleyCoords.lat, crdsOakleyCoords.lng, 15, false, true);

  constructor() { }

  public ngOnInit(): void {
  }


}
