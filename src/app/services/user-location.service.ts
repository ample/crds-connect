import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APIService } from './api.service';
import { GeoCoordinates } from '../models/geo-coordinates';
import { LocationService } from './location.service';
import { StateService } from './state.service';

@Injectable()
export class UserLocationService {

  constructor( private api: APIService,
               private location: LocationService ) { }

  public GetUserLocation(): GeoCoordinates {
    return this.getUserLocationFromIp();
   /* if ( this.api.isLoggedIn()) {
      try {

      }
      catch (e) {

      }*/
      // use profile address if it exists
      
      // if no address then use geolocation

      // use default if both fail
   // } else {

      // unauthenticated
      // use current location if user agrees
      // use the IP address to get a location
      // use the default location and zoom level
    //}
  }

  private getUserLocationFromUserId(userId: number): GeoCoordinates {
    return new GeoCoordinates(1, 2);

    /*this.api.getProfileById(6089102).subscribe(
        profile => {
          console.log('profile');
          this.address = profile.addressLine1 + ' , ' + profile.city + ' , ' + profile.state + ' , ' + profile.postalCode;
        },
        noProfile => {
          // use geolocation service
          console.log('no profile');
        });*/
  }

  private getUserLocationFromIp(): GeoCoordinates {
    let geo = new GeoCoordinates(0, 0);
    this.api.getMyIP().subscribe(
      result => {
        this.api.getLocationFromIP(result.ip).subscribe(
          location => {
            geo.lat = location.latitude;
            geo.lng = location.longitude;
          },
          error => {
            throw new Error('IP location failure');
          }
        );
      },
      error => {
        throw new Error('getMyIP failure');
      }
    );
    return geo;
  }

  private getUserLocationFromDefault(): GeoCoordinates {
    return this.location.getDefaultPosition();
  }

  private getUserLocationFromCurrentLocation(): GeoCoordinates {
    let geo = new GeoCoordinates(0, 0);
    this.location.getCurrentPosition().subscribe(
      pos => {
        geo.lat = pos.lat;
        geo.lng = pos.lng;
      },
      error => {
        throw new Error('Geo-Location Failure');
      }
    );
    return geo;
  }
}
