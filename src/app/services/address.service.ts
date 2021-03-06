import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { CacheableService, CacheLevel } from './base-service/cacheable.service';

import { SessionService } from './session.service';

import { Address, Pin, pinType, Group } from '../models';
import { environment } from '../../environments/environment';

@Injectable()
export class AddressService extends CacheableService<Pin[]> {

  private baseUrl = environment.CRDS_GATEWAY_CLIENT_ENDPOINT;

  constructor(private session: SessionService) {
    super();
  }

  public getFullAddress(id: number, addressType: pinType): Observable<Address> {
    let contactId = this.session.getContactId();
    if (super.isCachedForUser(contactId)) {
      let addressCache = super.getCache();

      let pin = addressCache.find(p => {
        return ((addressType == pinType.GATHERING && p.pinType == addressType && p.gathering.groupId == id) ||
          (addressType == pinType.PERSON && p.pinType == addressType && p.participantId == id));
      });

      if (pin != null) {
        console.log('AddressService got cached Address');
        if (addressType === pinType.PERSON) {
          return Observable.of(pin.address);
        } else {
          return Observable.of(pin.gathering.address);
        }
      }
    }

    return this.getAddressByTypeFromBackend(id, addressType);
  }

  public getPartialPersonAddress(id: number) {
    let contactId = this.session.getContactId();
    if (super.isCachedForUser(contactId)) {
      let addressCache = super.getCache();
      let pin = addressCache.find(p => {
        return (p.pinType === pinType.PERSON && p.participantId === id);
      });

      if (pin != null) {
        console.log('AddressService got cached Address');
        return Observable.of(pin.address);
      }
    }

    return this.getAddressByTypeFromBackend(id, pinType.PERSON, false);
  }

  public clearCache(): void {
    super.clearCache();
  }

  private getAddressByTypeFromBackend(id: number, addressType: pinType, shouldGetFullAddress: boolean = true): Observable<Address> {
    // tslint:disable-next-line:max-line-length
    let url = addressType === pinType.GATHERING ? `${this.baseUrl}api/v1.0.0/finder/group/address/${id}` : `${this.baseUrl}api/v1.0.0/finder/person/address/${id}/${shouldGetFullAddress}`;
    let contactId = this.session.getContactId();
    return this.session.get(url)
      .do((res: Address) => {
        let cache: Array<Pin> = new Array<Pin>();
        if (super.isAtLeastPartialCache() && super.isCachedForUser(contactId)) {
          console.log('AddressService got new Address and added them to the cache');
          cache = super.getCache();
        } else {
          console.log('AddressService got new Address and created a new cache');
        }
        let pin = Pin.overload_Constructor_One();
        pin.pinType = addressType;
        if (addressType === pinType.PERSON) {
          pin.address = res;
        }
        if (addressType === pinType.GATHERING) {
          console.log('AddressService added new GroupAddress');
          pin.gathering = new Group();
          pin.gathering.address = res;
          pin.gathering.groupId = id;
        } else {
          console.log('AddressService added new PersonAddress');
          pin.participantId = id;
        }
        cache.push(pin);
        super.setCache(cache, CacheLevel.Partial, contactId);
      })
      .catch((error: any) => Observable.throw(error || 'Server exception'));
  }
}
