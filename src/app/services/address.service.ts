import { EventEmitter  } from '@angular/core';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { CacheableService, CacheLevel } from './base-service/cacheable.service';

import { SessionService } from './session.service';

import { Address } from '../models/address';
import { Pin, pinType } from '../models/pin';
import { Group } from '../models/group';

@Injectable()
export class AddressService extends CacheableService<Pin[]> {

    private baseUrl = process.env.CRDS_GATEWAY_CLIENT_ENDPOINT;
    public groupAddressFormFieldClearEmitter: EventEmitter<void>;

    constructor(private session: SessionService) {
        super();
        // TODO: Remove this emitter.
        this.groupAddressFormFieldClearEmitter = new EventEmitter<void>();
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

    public emitClearGroupAddressForm(): void {
      this.groupAddressFormFieldClearEmitter.emit();
    }

    private getAddressByTypeFromBackend(id: number, addressType: pinType): Observable<Address> {
        // tslint:disable-next-line:max-line-length
        let url = addressType === pinType.GATHERING ? `${this.baseUrl}api/v1.0.0/finder/group/address/${id}` : `${this.baseUrl}api/v1.0.0/finder/person/address/${id}`;
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

    public clearCache(): void {
        super.clearCache();
    }
}
