import { MapView } from '../models/index';
import { StateService } from './state.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { crdsOakleyCoords, centerOfTheUsCoords } from '../shared/constants';
import { GeoCoordinates } from '../models/geo-coordinates';


@Injectable()
export class GeoLocationService {
  private wholeUsZoomLevel: number = 5;
  constructor(private state: StateService) {}

  public getCurrentPosition(): Observable<GeoCoordinates> {
    const positionObs = new Observable<GeoCoordinates>( observer => {
      // If no input in 15s don't wait
      window.setTimeout(() => {
        observer.error();
      }, 10000);
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

  public getPositionFromGeoLocation(): Observable<GeoCoordinates> {
    const geoLocationObservable: Observable<GeoCoordinates> = new Observable( observer => {
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
    this.state.setUseZoom(this.wholeUsZoomLevel);
    return new GeoCoordinates(centerOfTheUsCoords.lat, centerOfTheUsCoords.lng);
  }

}
