import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { crdsOakleyCoords } from '../shared/constants';
import { GeoCoordinates } from '../models/geo-coordinates';


@Injectable()
export class LocationService {

  constructor() { }

  public getCurrentPosition(): Observable<any> {

    let isGeoLocationAvailable: boolean = Boolean(navigator.geolocation);

    let positionObs = new Observable( observer => {
      if (isGeoLocationAvailable) {
        this.getPositionFromGeoLocation().subscribe(
            geoLocPos => {
              observer.next(geoLocPos);
            }
        );
      } else {
        let defaultPos: any = this.getDefaultPosition();
        observer.next(defaultPos);
      }
    });

    return positionObs;
  };

  public getPositionFromGeoLocation(): Observable<any> {
    let geoLocationObservable: Observable<any> = new Observable( observer => {
      let position: GeoCoordinates;

      navigator.geolocation.getCurrentPosition(pos => {
        position = new GeoCoordinates(pos.coords.latitude, pos.coords.longitude);
        observer.next(position);
      }, () => {
        position =  this.getDefaultPosition();
        observer.next(position);
      }, { maximumAge: 600000, timeout: 5000, enableHighAccuracy: true});
    });

    return geoLocationObservable;
  };

  public getDefaultPosition(): GeoCoordinates {
    return new GeoCoordinates(crdsOakleyCoords.lat, crdsOakleyCoords.long);
  };

}
