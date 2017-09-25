import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { crdsOakleyCoords } from '../shared/constants';
import { GeoCoordinates } from '../models/geo-coordinates';


@Injectable()
export class LocationService {
  constructor() {}

  public getCurrentPosition(): Observable<any> {
    const positionObs = new Observable( observer => {
      const isGeoLocationAvailable: boolean = Boolean(navigator.geolocation);
      if (isGeoLocationAvailable) {
        this.getPositionFromGeoLocation()
        .subscribe(
          geoLocPos => {
            observer.next(geoLocPos);
          },
          error => {
            observer.error();
          }
        );
      } else {
        observer.next(this.getDefaultPosition());
      }
    });

    return positionObs;
  }

  public getPositionFromGeoLocation(): Observable<any> {
    const geoLocationObservable: Observable<any> = new Observable( observer => {
      let position: GeoCoordinates;

      navigator.geolocation.getCurrentPosition(pos => {
        // user chose ALLOW location detection
        position = new GeoCoordinates(pos.coords.latitude, pos.coords.longitude);
        observer.next(position);
      },
      () => {
        // user chose BLOCK location detection
        observer.error();
      }, { maximumAge: 600000, timeout: 5000, enableHighAccuracy: true});
    });
    return geoLocationObservable;
  }

  public getDefaultPosition(): GeoCoordinates {
    return new GeoCoordinates(crdsOakleyCoords.lat, crdsOakleyCoords.lng);
  }

}
