import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CacheableService, CacheLevel } from './base-service/cacheable.service';
import { IPService } from './ip.service';
import { GeoCoordinates, User } from '../models';
import { GeoLocationService } from './geo-location.service';
import { SessionService } from './session.service';

@Injectable()
export class UserLocationService extends CacheableService<GeoCoordinates> {
  constructor(private ipService: IPService,
    private geoLocation: GeoLocationService,
    private session: SessionService) {
    super();
  }

  public clearCache() {
    super.clearCache();
  }

  /* Gets the location for the center of the map. Should be subscribed to only with the first().subscribe option. Only successes are returned until the default loc */
  public GetUserLocation(): Observable<GeoCoordinates> {
    const contactId: number = this.session.getContactId();
    if (this.isCachedForUser(contactId)) {
      return Observable.of(this.getCache());
    } else {
      return this.getLocationFromGeolocation(contactId)
        .concat(this.getLocationByContactId(contactId))
        .concat(this.getUserLocationFromIpAddress(contactId))
        .catch(err => Observable.of(this.getUserLocationFromDefault()));
    }
  }

  private getLocationFromGeolocation(contactId: number): Observable<GeoCoordinates> {
    return this.geoLocation.getCurrentPosition().onErrorResumeNext().map(
      (cords: GeoCoordinates) => {
        if (cords.lat == null || cords.lng == null) {
          Observable.throw('No lat lng returned');
        } else {
          const pos = new GeoCoordinates(cords.lat, cords.lng);
          this.setLocalCache(pos, contactId);
          return pos;
        }
      }
    );
  }

  private getUserLocationFromIpAddress(contactId: number): Observable<GeoCoordinates> {
    return this.ipService.getLocationFromIP().map(
      (cords: any) => {
        const pos = new GeoCoordinates(cords.latitude, cords.longitude);
        this.setLocalCache(pos, contactId);
        return pos;
      }
    );
  }

  private getLocationByContactId(contactId: number): Observable<GeoCoordinates> {
    if (contactId) {
      return this.session.getUserDetailsByContactId(contactId).onErrorResumeNext().map(
        (userData: User) => {
          const pos = new GeoCoordinates(userData.address.latitude, userData.address.longitude);
          this.setLocalCache(pos, contactId);
          return pos;
        }
      );
    } else {
      return Observable.throw('No contact Id').onErrorResumeNext();
    }
  }

  /* If there is no cache set this sets the cache. */
  private setLocalCache(coords: GeoCoordinates, contactId: number) {
    if (!this.getCache()) {
      super.setCache(coords, CacheLevel.Full, contactId);
    }
  }

  private getUserLocationFromDefault(): GeoCoordinates {
    const position = this.geoLocation.getDefaultPosition();
    super.setCache(position, CacheLevel.Full);
    return position;
  }
}
