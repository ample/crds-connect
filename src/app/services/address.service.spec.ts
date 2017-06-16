import { MockTestData } from '../shared/MockTestData';
import { Observable } from 'rxjs/Rx';
import { pinType, Pin, Address } from '../models';
import { SessionService } from './session.service';
import { CacheableService, CacheLevel } from './base-service/cacheable.service';

import { TestBed, async, inject } from '@angular/core/testing';
import { AddressService } from './address.service';

describe('AddressService', () => {
    let service;
    let mockSessionService;

    beforeEach(() => {
        mockSessionService = jasmine.createSpyObj<SessionService>('session', ['getContactId', 'get', 'post']);
        TestBed.configureTestingModule({
            providers: [
                AddressService,
                { provide: SessionService, useValue: mockSessionService }
            ]
        });
    });

    // you can also wrap inject() with async() for asynchronous tasks
    // it('...', async(inject([...], (...) => {}));

    it('should instantiate',
        inject([AddressService], (addressService: AddressService) => {
            expect(addressService).toBeTruthy();
            // expect('1').toEqual(1);
        })
    );

    it('should get full person address without cache',
        inject([AddressService], (addressService: AddressService) => {
            let address = MockTestData.getAnAddress(3);
            (mockSessionService.getContactId).and.returnValue(null);
            (mockSessionService.get).and.returnValue(
                Observable.of(address)
            );
            addressService.getFullAddress(1, pinType.PERSON).subscribe( (data) => {
                expect(data).toEqual(address);
                expect(mockSessionService.get).toHaveBeenCalledWith(`${addressService['baseUrl']}api/v1.0.0/finder/person/address/1/true`);
            });
        }));

    it('should get full person address with cache',
        inject([AddressService], (addressService: AddressService) => {
            let pinsCache: Pin[] = [];
            pinsCache.push(MockTestData.getAPin(1));
            pinsCache[0].pinType = pinType.PERSON;
            addressService['cache'] = pinsCache;
            addressService['cacheLevel'] = CacheLevel.Partial;
            addressService['userIdentifier'] = 2;

            (mockSessionService.getContactId).and.returnValue(2);

            addressService.getFullAddress(1, pinType.PERSON).subscribe( (data) => {
                expect(data).toEqual(pinsCache[0].address);
                expect(mockSessionService.get).not.toHaveBeenCalled();
            });
        }));

        it('should  get partial person address without cache',
        inject([AddressService], (addressService: AddressService) => {
            let address: Address = MockTestData.getAnAddress(5);
            // Makes it more real world I guess. 
            address.addressLine1 = null;
            address.addressLine2 = null;

            (mockSessionService.getContactId).and.returnValue(null);
            (mockSessionService.get).and.returnValue(
                Observable.of(address)
            );

            addressService.getFullAddress(1, pinType.PERSON).subscribe( (data) => {
                expect(data).toEqual(address);
                expect(mockSessionService.get).toHaveBeenCalledWith(`${addressService['baseUrl']}api/v1.0.0/finder/person/address/1/true`);
            });
        }));

        it('should  get partial person address with cache',
        inject([AddressService], (addressService: AddressService) => {
            let pinsCache: Pin[] = [];
            pinsCache.push(MockTestData.getAPin(1));
            pinsCache[0].pinType = pinType.PERSON;
            addressService['cache'] = pinsCache;
            addressService['cacheLevel'] = CacheLevel.Partial;
            addressService['userIdentifier'] = 2;

            (mockSessionService.getContactId).and.returnValue(2);

            addressService.getFullAddress(1, pinType.PERSON).subscribe( (data) => {
                expect(data).toEqual(pinsCache[0].address);
                expect(mockSessionService.get).not.toHaveBeenCalled();
            });
        }));



});
