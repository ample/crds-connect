import { Injectable, NgZone } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { SessionService } from './session.service';

import { IFrameParentService } from './iframe-parent.service';
import { GeoCoordinates } from '../models/geo-coordinates';
import { User } from '../models/user';

import { crdsOakleyCoords } from '../shared/constants';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class LocationService {

  private baseUrl = process.env.CRDS_API_ENDPOINT;
  public position: GeoCoordinates;

  constructor( private http: Http,
               private session: SessionService) { }

  public getCurrentPosition(): any {

    let isGeoLocationAvailable: boolean = Boolean(navigator.geolocation);

    let positionObs = new Observable( observer => {
      if(isGeoLocationAvailable){
        this.getPositionFromGeoLocation().subscribe(
            geoLocPos => {
              observer.next(geoLocPos);
            }
        )
      } else {
        let defaultPos: any = this.getDefaultPosition();
        observer.next(defaultPos);
      }
    });

    return positionObs;
  };

  public getPositionFromGeoLocation(): any {
    let geoLocationObservable = new Observable( observer => {
      let position: GeoCoordinates;

      navigator.geolocation.getCurrentPosition(pos => {
        position = new GeoCoordinates(pos.coords.latitude, pos.coords.longitude);
        observer.next(position);
      }, () => {
        position =  this.getDefaultPosition();
        observer.next(position);
      });
    });

    return geoLocationObservable;
  };

  public getDefaultPosition(): GeoCoordinates{
    return new GeoCoordinates(crdsOakleyCoords.lat, crdsOakleyCoords.long);
  };

}
