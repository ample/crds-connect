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

  public GetUserLocation(): Observable<any> {
    //return this.getUserLocationFromIp();
  
    let locationObs = new Observable( observer => {

        this.getUserLocationFromIp().subscribe(
            ipLocPos => {
              observer.next(ipLocPos);
            }
        );
    });

    return locationObs;
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

  public getUserLocationFromIp(): Observable<any> {
    let ipObs = new Observable ( observer => {
      let position: GeoCoordinates;

      this.api.getLocationFromIP().subscribe(
          location => {
            position = new GeoCoordinates(location.latitude, location.longitude);
            observer.next(position);
          },
          error => {
            throw new Error('IP location failure');
          }
        );
      });
    return ipObs;
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
