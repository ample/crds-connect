import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CacheableService, CacheLevel } from './base-service/cacheable.service';

import { IPService } from './ip.service';
import { GeoCoordinates } from '../models/geo-coordinates';
import { GoogleMapService } from '../services/google-map.service';
import { LocationService } from './location.service';
import { SessionService } from './session.service';
import { StateService } from './state.service';
import { PinService } from './pin.service';

@Injectable()
export class UserLocationService extends CacheableService<GeoCoordinates> {

  constructor(private ipService: IPService,
    private location: LocationService,
    private session: SessionService,
    private mapHlpr: GoogleMapService,
    private state: StateService) {
    super();
  }

  public clearCache() {
    super.clearCache();
  }

  public GetUserLocation(): Observable<any> {
    let contactId = this.session.getContactId();
    if ( !this.state.navigatedFromAddToMapComponent && super.isCachedForUser(contactId)) {
      return Observable.of(super.getCache());
    }
    let locObs = new Observable(observer => {
      if (this.session.isLoggedIn()) {
        let contactid: number = this.session.getContactId();
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
    let profileObs = new Observable(observer => {
      let position: GeoCoordinates;

      this.session.getUserDetailsByContactId(contactId).subscribe(
        success => {
          position = new GeoCoordinates(success.address.latitude, success.address.longitude);
          super.setCache(position, CacheLevel.Full, contactId);
          observer.next(position);
        },
        failure => {
          observer.error();
        }
      );

    });
    return profileObs;
  }

  private getUserLocationFromIp(): Observable<any> {
    let contactId = this.session.getContactId();
    let ipObs = new Observable(observer => {
      let position: GeoCoordinates;

      this.ipService.getLocationFromIP().subscribe(
        location => {
          position = new GeoCoordinates(location.latitude, location.longitude);
          super.setCache(position, CacheLevel.Full, contactId);
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
    let position = this.location.getDefaultPosition();
    super.setCache(position, CacheLevel.Full);
    return position;
  }

  private getUserLocationFromCurrentLocation(): Observable<any> {
    let contactId = this.session.getContactId();
    let locObs = new Observable(observer => {
      // On FF, user is not allowed time to allow/block location detection
      // assumption is block and IP detection is used
      // REMOVED previous fix with 15 sec timeout to accomodate FF

      let position: GeoCoordinates;

      this.location.getCurrentPosition().subscribe(
        location => {
          this.mapHlpr.setDidUserAllowGeoLoc(true);
          if (location.lat == null || location.lng == null) {
            observer.error();
          } else {
            position = new GeoCoordinates(location.lat, location.lng);
            super.setCache(position, CacheLevel.Full, contactId);
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

  public clearUserLocationCache(): void {
    super.clearCache();
  }
}
