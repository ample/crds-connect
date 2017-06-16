import { Address } from '../../../../models';
import { Observable } from 'rxjs/Rx';
import { MockTestData } from '../../../../shared/MockTestData';
import { AddressService } from '../../../../services/address.service';
import { BlandPageService } from '../../../../services/bland-page.service';
import { StateService } from '../../../../services/state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantService } from '../../../../services/participant.service';
import { MockComponent } from '../../../../shared/mock.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ParticipantDetailsComponent } from './participant-details.component';

class ActivatedRouteStub {
    params = Observable.of({ groupId: 1234, groupParticipantId: 1 });

    set testParams(params: any) {
        this.params = Observable.of(params);
    }
}

describe('ParticipantDetailsComponent', () => {
    let fixture: ComponentFixture<ParticipantDetailsComponent>;
    let comp: ParticipantDetailsComponent;
    let el;
    let mockParticipantService, mockRouter,
        mockStateService, mockBlandPageService, mockAddressService;
    let mockRoute: ActivatedRouteStub;

    beforeEach(() => {
        mockParticipantService = jasmine.createSpyObj('participantService', ['getParticipants']);
        mockRouter = { url: '/small-group/1234' };
        mockRoute = new ActivatedRouteStub();
        mockStateService = jasmine.createSpyObj('state', ['setLoading', 'setPageHeader']);
        mockBlandPageService = jasmine.createSpyObj('blandPageService', ['goToDefaultError']);
        mockAddressService = jasmine.createSpyObj('addressService', ['getPartialPersonAddress']);

        TestBed.configureTestingModule({
            declarations: [
                ParticipantDetailsComponent,
                MockComponent({ selector: 'profile-picture', inputs: ['imageClass', 'wrapperClass', 'contactid'] }),
                MockComponent({ selector: 'readonly-address', inputs: ['isGathering', 'isPinOwner', 'isInGathering', 'address'] })
            ],
            providers: [
                { provide: ParticipantService, useValue: mockParticipantService },
                { provide: ActivatedRoute, useValue: mockRoute },
                { provide: Router, useValue: mockRouter },
                { provide: StateService, useValue: mockStateService },
                { provide: BlandPageService, useValue: mockBlandPageService },
                { provide: AddressService, useValue: mockAddressService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ParticipantDetailsComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('should init with all data', () => {
        (mockParticipantService.getParticipants).and.returnValue(Observable.of(MockTestData.getAParticipantsArray()));
        (mockAddressService.getPartialPersonAddress).and.returnValue(Observable.of(MockTestData.getAnAddress()));

        comp.ngOnInit();
        expect(comp['participant'].participantId).toBe(1);
        expect(comp['isValidAddress']).toBeTruthy();
        expect(mockStateService.setPageHeader).toHaveBeenCalledWith('Participant', '/small-group/1234');
        expect(mockStateService.setLoading).toHaveBeenCalledTimes(2);

    });

    it('should init without address', () => {
        (mockParticipantService.getParticipants).and.returnValue(Observable.of(MockTestData.getAParticipantsArray()));
        (mockAddressService.getPartialPersonAddress).and.returnValue(Observable.of(null));

        comp.ngOnInit();

        expect(comp['participant'].participantId).toBe(1);
        expect(comp['isValidAddress']).toBeFalsy();
        expect(mockStateService.setPageHeader).toHaveBeenCalledWith('Participant', '/small-group/1234');
        expect(mockStateService.setLoading).toHaveBeenCalledTimes(2);
    });

    it('should init on get address error', () => {
        (mockParticipantService.getParticipants).and.returnValue(Observable.of(MockTestData.getAParticipantsArray()));
        (mockAddressService.getPartialPersonAddress).and.returnValue(Observable.throw({error: 'nooooo'}));

        comp.ngOnInit();

        expect(comp['participant'].participantId).toBe(1);
        expect(comp['isValidAddress']).toBeFalsy();
        expect(mockStateService.setPageHeader).toHaveBeenCalledWith('Participant', '/small-group/1234');
        expect(mockStateService.setLoading).toHaveBeenCalledTimes(2);
    });

    it('should handle participant not found in array', () => {
        mockRoute.params = Observable.of({groupId: 1234, groupParticipantId: 9999});
        (mockParticipantService.getParticipants).and.returnValue(Observable.of(MockTestData.getAParticipantsArray()));

        comp.ngOnInit();

        expect(comp['participant']).toBeUndefined();
        expect(comp['isValidAddress']).toBeFalsy();
        expect(mockAddressService.getPartialPersonAddress).not.toHaveBeenCalled();
        expect(mockBlandPageService.goToDefaultError).toHaveBeenCalledWith('/small-group/1234');
    });

    it('should handle error on getParticipants call', () => {
        (mockParticipantService.getParticipants).and.returnValue(Observable.throw({error: 'noooo'}));

        comp.ngOnInit();

        expect(mockBlandPageService.goToDefaultError).toHaveBeenCalledWith('/small-group/1234');
    });

    it('AddressValid should return true if full address is passed in', () => {
        comp['participantAddress'] = MockTestData.getAnAddress();
        let result = comp.isParticipantAddressValid();
        expect(result).toBe(true);
    });

    it('AddressValid should return true if address has one of city, state, or zip is filled out', () => {
        let address: Address = MockTestData.getAnAddress();
        address.addressLine1 = null;
        address.addressLine2 = null;
        comp['participantAddress'] = address;

        let result = comp.isParticipantAddressValid();
        expect(result).toBe(true);

        address.city = null;
        address.state = null;
        console.log(comp['participantAddress']);
        result = comp.isParticipantAddressValid();
        expect(result).toBe(true);

        address.city = 'Trenton';
        address.zip = null;
        result = comp.isParticipantAddressValid();
        expect(result).toBe(true);

        address.city = null;
        address.state = 'Ohio';
        result = comp.isParticipantAddressValid();
        expect(result).toBe(true);
    });

    it('AddressValid should return false when there is no object or all of zip, city, and state are null', () => {
        comp['participantAddress'] = null;
        let result = comp.isParticipantAddressValid();
        console.log('result 1: ' + result);
        expect(result).toBe(false);

        comp['participantAddress'] = undefined;
        result = comp.isParticipantAddressValid();
        console.log('result 2: ' + result);
        expect(result).toBe(false);

        let address = MockTestData.getAnAddress();
        address.state = null;
        address.city = null;
        address.zip = null;
        comp['participantAddress'] = address;
        result = comp.isParticipantAddressValid();
        console.log('result 3: ' + result);
        expect(result).toBe(false);
    });
});
