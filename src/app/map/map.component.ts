import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { APIService } from '../services/api.service';
import { crdsOakleyCoords } from '../shared/constants';
import { LoginRedirectService } from '../services/login-redirect.service';
import { LocationService } from '../services/location.service';
import { MapSettings } from '../models/map-settings';
import { UserLocationService } from  '../services/user-location.service';

@Component({
  selector: 'app-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.css']
})
export class MapComponent implements OnInit {

  public mapSettings: MapSettings  = new MapSettings(crdsOakleyCoords.lat, crdsOakleyCoords.lng, 15, false, true);
  public address: string;

  constructor(private api: APIService,
              private loginRedirectService: LoginRedirectService,
              private router: Router,
              private locationService: LocationService,
              private userLocationService: UserLocationService) {
  }

  public ngOnInit(): void {
    this.userLocationService.GetUserLocation().subscribe(
      pos => {
        this.mapSettings.lat = pos.lat;
        this.mapSettings.lng = pos.lng;
      }
    );
  }
}
