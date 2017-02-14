import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { APIService } from '../services/api.service';
import { crdsOakleyCoords } from '../shared/constants';
<<<<<<<
import { LoginRedirectService } from '../services/login-redirect.service';
=======
import { LocationService } from '../services/location.service';
>>>>>>>
import { MapSettings } from '../models/map-settings';



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
              private router: Router) {
  }
  constructor(private locationService: LocationService) { }

  public ngOnInit(): void {

    if (!this.api.isLoggedIn()) {
        this.loginRedirectService.redirectToLogin(this.router.routerState.snapshot.url);
    }

    this.mapSettings.lat = 51.0;
    this.mapSettings.lng = -84.1;
    console.log('phil is cool');
    this.setUserLocation();
    this.locationService.getCurrentPosition().subscribe(
      pos => {
        this.mapSettings.lat = pos.lat;
        this.mapSettings.lng = pos.lng;
      }
    );
  }

  public setUserLocation() {
    // authenticated
    if ( this.api.isLoggedIn()) {
      // use profile address if it exists
      this.api.getProfileById(6089102).subscribe(
        profile => {
          console.log('profile');
          this.address = profile.addressLine1 + ' , ' + profile.city + ' , ' + profile.state + ' , ' + profile.postalCode;
        },
        noProfile => {
          // use victors geolocation service
          console.log('no profile');
        }
      );
      // if no address then use geolocation
    } else {
      
      // unauthenticated
      // use current location if user agrees
      // use the IP address to get a location
      // use the default location and zoom level
    }
  }

  private getProfile(id: number): Observable<any> {
    let profile: Observable<any>;

    profile = this.api.getProfileById(id);
    return profile;
  }
}
