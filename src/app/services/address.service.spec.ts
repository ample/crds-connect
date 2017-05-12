import { MockTestData } from '../shared/MockTestData';
import { LoginRedirectService } from './login-redirect.service';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, XHRBackend, ResponseOptions, Response } from '@angular/http';
import { AddressService } from './address.service';
import { async, inject, TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { pinType, Pin, Group } from '../models';
import { CacheLevel } from './base-service/cacheable.service';

describe('AddressService', () => {
    let service;
    let mockSessionService,
        mockCookieService,
        mockLoginRedirectService,
        mockRouter;
    let mockFullAddressData = {
        addressId: 0,
        addressLine1: 'address line 1',
        addressLine2: '',
        city: 'City!',
        state: 'OH',
        zip: '12345',
        foreignCountry: 'Murica',
        county: 'county',
        longitude: 12,
        latitude: 3
    };

    beforeEach(() => {
        mockCookieService = { get: jest.fn(), set: jest.fn() };
        mockRouter = { navigate: jest.fn() };
        mockLoginRedirectService = { };
        TestBed.configureTestingModule({
            providers: [
                AddressService,
                SessionService,
                { provide: XHRBackend, useClass: MockBackend },
                { provide: CookieService, useValue: mockCookieService },
                { provide: Router, useValue: mockRouter },
                { provide: LoginRedirectService, useValue: mockLoginRedirectService }
            ],
            imports: [HttpModule]
        });
    });

    // you can also wrap inject() with async() for asynchronous tasks
    // it('...', async(inject([...], (...) => {}));

    it('should get full address for person',
        inject([AddressService, XHRBackend, SessionService], (s: AddressService, mockBackend: any, session: SessionService) => {

            jest.spyOn(session, 'getContactId').mockReturnValue(1);

            mockBackend.connections.subscribe((connection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(mockFullAddressData)
                })));
            });
            s.getFullAddress(1, pinType.PERSON).subscribe((address) => {
                expect(address).toMatchObject(mockFullAddressData);
            });
        })
    );

    it('should get full address for person from cache',
        inject([AddressService, XHRBackend, SessionService], (s: AddressService, mockBackend: any, session: SessionService) => {
            jest.spyOn(session, 'getContactId').mockReturnValue(1);
            let address = MockTestData.getAnAddress(1);
            let pin = Pin.overload_Constructor_One();
                pin.pinType = pinType.PERSON;
                pin.address = address;
                pin.participantId = 1;
                let cache = new Array<Pin>();
                cache.push(pin);
                s['setCache'](cache, CacheLevel.Partial, 1);

            s.getFullAddress(1, pinType.PERSON).subscribe((newAddress) => {
                expect(newAddress).toMatchObject(address);
            });
        })
    );

     it('should get full address for gathering',
        inject([AddressService, XHRBackend, SessionService], (s: AddressService, mockBackend: any, session: SessionService) => {

            jest.spyOn(session, 'getContactId').mockReturnValue(1);

            mockBackend.connections.subscribe((connection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(mockFullAddressData)
                })));
            });
            s.getFullAddress(1, pinType.GATHERING).subscribe((address) => {
                expect(address).toMatchObject(mockFullAddressData);
            });
        })
    );

    it('should get full address for person from cache',
        inject([AddressService, XHRBackend, SessionService], (s: AddressService, mockBackend: any, session: SessionService) => {
            jest.spyOn(session, 'getContactId').mockReturnValue(1);
            let address = MockTestData.getAnAddress(1);
            let pin = Pin.overload_Constructor_One();
                pin.pinType = pinType.PERSON;
                pin.address = address;
                pin.participantId = 1;
                pin.gathering = new Group();
                pin.gathering.groupId = 1;
                let cache = new Array<Pin>();
                cache.push(pin);
                s['setCache'](cache, CacheLevel.Partial, 1);

            s.getFullAddress(1, pinType.PERSON).subscribe((newAddress) => {
                expect(newAddress).toMatchObject(address);
            });
        })
    );
});
