import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APIService } from './api.service';
import { GeoCoordinates } from '../models/geo-coordinates';
import { LocationService } from './location.service';
import { SessionService } from './session.service';
import { StateService } from './state.service';
import { PinService } from './pin.service';

@Injectable()
export class UserLocationService {

  constructor( private api: APIService,
               private location: LocationService,
               private session: SessionService,
               private pinservice: PinService ) { }

  public GetUserLocation(): Observable<any> {
    let locObs = new Observable( observer => {
      if (this.api.isLoggedIn()) {

        let contactid: number = this.session.getContactId(); //get contactid from cookie

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

      this.pinservice.getPinDetailsByContactId(contactId).subscribe(
        success => {
          position = new GeoCoordinates(success.address.latitude, success.address.longitude);
            observer.next(position);
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
          position = new GeoCoordinates(location.lat, location.lng);
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
