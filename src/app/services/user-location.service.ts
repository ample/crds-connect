import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APIService } from './api.service';
import { GeoCoordinates } from '../models/geo-coordinates';
import { GoogleMapService } from '../services/google-map.service';
import { LocationService } from './location.service';
import { SessionService } from './session.service';
import { StateService } from './state.service';
import { PinService } from './pin.service';

@Injectable()
export class UserLocationService {

  constructor( private api: APIService,
               private location: LocationService,
               private session: SessionService,
               private pinservice: PinService,
               private mapHlpr: GoogleMapService) { }

  public GetUserLocation(): Observable<any> {
    let locObs = new Observable( observer => {
      if (this.api.isLoggedIn()) {

        let contactid: number = this.session.getContactId(); // get contactid from cookie

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
        },
        failure => {
          observer.error();
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
          observer.error();
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

      //If user does not allow location within 15 seconds, throw - this is a fix for Firefox hanging on 'Not now'
      this.mapHlpr.setDidUserAllowGeoLoc(false);

      setTimeout(() => {
        if(!this.mapHlpr.didUserAllowGeoLoc){
          observer.error();
        }
      }, 15000);

      let position: GeoCoordinates;

      this.location.getCurrentPosition().subscribe(
        location => {
          this.mapHlpr.setDidUserAllowGeoLoc(true);
          if (location.lat == null || location.lng == null) {
            observer.error();
          }  else {
            position = new GeoCoordinates(location.lat, location.lng);
            observer.next(position);
          }
        },
        error => {
          this.mapHlpr.setDidUserAllowGeoLoc(true);
          observer.error();
        }
      );

    });

    return locObs;
  }
}
