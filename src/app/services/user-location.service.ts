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
    let locObs = new Observable( observer => {
      if (this.api.isLoggedIn()) {

        let contactid: number = 123; //get contactid from cookie

        this.getUserLocationFromUserId(contactid).subscribe(
          success => {
            observer.next(success);
          },
          failure => {
            this.getUserLocationFromCurrentLocation().subscribe(
              location => {
                observer.next(location);
              },
              error => {
                observer.next(this.getUserLocationFromDefault());
              }
            );
          }
        );
      } else {
        this.getUserLocationFromCurrentLocation().subscribe(
          success => {
            observer.next(success);
          },
          failure => {
            this.getUserLocationFromIp().subscribe(
              ipLocPos => {
                observer.next(ipLocPos);
              },
              error => {
                observer.next(this.getUserLocationFromDefault());
              }
            );
          }
        );
      }
    });
    return locObs;
  }

  private getUserLocationFromUserId(contactId: number): Observable<any> {
    let profileObs = new Observable ( observer => {
      let position: GeoCoordinates;

      this.api.getProfileById(contactId).subscribe(
          location => {
            position = new GeoCoordinates(location.latitude, location.longitude);
            observer.next(position);
          },
          error => {
            throw new Error('IP location failure');
          }
        );
      });
    return profileObs;
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

  private getUserLocationFromCurrentLocation(): Observable<any> {
    let locObs = new Observable ( observer => {
      let position: GeoCoordinates;

      this.location.getCurrentPosition().subscribe(
        location => {
          position = new GeoCoordinates(location.latitude, location.longitude);
          observer.next(position);
        },
        error => {
          throw new Error('Geo-Location Failure');
        }
      );
    });
    return locObs;
  }
}
