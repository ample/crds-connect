import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { crdsOakleyCoords } from '../shared/constants';
import { LocationService } from '../services/location.service';
import { MapSettings } from '../models/map-settings';

@Component({
  selector: 'app-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.css']
})
export class MapComponent implements OnInit {

  public mapSettings: MapSettings  = new MapSettings(crdsOakleyCoords.lat, crdsOakleyCoords.lng, 15, false, true);

  constructor(private locationService: LocationService) { }

  public ngOnInit(): void {
    this.locationService.getCurrentPosition().subscribe(
      pos => {
        this.mapSettings.lat = pos.lat;
        this.mapSettings.lng = pos.lng;
      }
    );
  }


}
