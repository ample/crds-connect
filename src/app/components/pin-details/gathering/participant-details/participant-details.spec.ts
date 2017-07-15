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

fdescribe('ParticipantDetailsComponent', () => {
    let fixture: ComponentFixture<ParticipantDetailsComponent>;
    let comp: ParticipantDetailsComponent;
    let el;
    let mockParticipantService, mockRouter,
        mockStateService, mockBlandPageService, mockAddressService;
    let mockRoute: ActivatedRouteStub;

    beforeEach(() => {
        mockParticipantService = jasmine.createSpyObj('participantService', ['getGroupParticipant', 'getAllParticipantsOfRoleInGroup']);
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

    it('should init', () => {
        spyOn(comp, 'loadParticipantData');
        comp.ngOnInit();
        expect(comp['loadParticipantData']).toHaveBeenCalledTimes(1);
        expect(comp['groupId']).toBe(1234);
        expect(comp['groupParticipantId']).toBe(1);
        expect(mockStateService.setLoading).toHaveBeenCalledWith(true);
    });

    it('should loadParticipantData happiest path', () => {
        let groupId = 44;
        let groupParticipantId = 42;
        let participant = MockTestData.getAParticipantsArray()[0];
        let address = MockTestData.getAnAddress();
        comp['groupId'] = groupId;
        comp['groupParticipantId'] = groupParticipantId;
        comp['redirectUrl'] = '/test';

        (mockParticipantService.getGroupParticipant).and.returnValue(Observable.of(participant));
        (mockAddressService.getPartialPersonAddress).and.returnValue(Observable.of(address));

        (mockParticipantService.getAllParticipantsOfRoleInGroup).and.returnValue(Observable.of(MockTestData.getAParticipantsArray()));

        comp['loadParticipantData']();
        expect(mockParticipantService.getGroupParticipant).toHaveBeenCalledWith(groupId, groupParticipantId);
        expect(mockAddressService.getPartialPersonAddress).toHaveBeenCalledWith(participant.participantId);
        expect(mockStateService.setPageHeader).toHaveBeenCalledWith('Participant', '/test');
        expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
        expect(comp['participant']).toBe(participant);
        expect(comp['participantAddress']).toBe(address);
        expect(comp['componentIsReady']).toBe(true);
        expect(comp['isValidAddress']).toBe(true);
    });

    it('should loadParticipantData without address', () => {
        let groupId = 44;
        let groupParticipantId = 42;
        let participant = MockTestData.getAParticipantsArray()[1];
        comp['groupId'] = groupId;
        comp['groupParticipantId'] = groupParticipantId;
        comp['redirectUrl'] = '/small-group/1234';

        (mockParticipantService.getGroupParticipant).and.returnValue(Observable.of(participant));
        (mockAddressService.getPartialPersonAddress).and.returnValue(Observable.of(null));
        (mockParticipantService.getAllParticipantsOfRoleInGroup).and.returnValue(Observable.of(MockTestData.getAParticipantsArray()));

        comp['loadParticipantData']();

        expect(comp['participant'].participantId).toBe(1);
        expect(comp['isValidAddress']).toBeFalsy();
        expect(mockStateService.setPageHeader).toHaveBeenCalledWith('Participant', '/small-group/1234');
        expect(mockStateService.setLoading).toHaveBeenCalledTimes(1);
        expect(mockParticipantService.getGroupParticipant).toHaveBeenCalledTimes(1);
        expect(mockAddressService.getPartialPersonAddress).toHaveBeenCalledTimes(1);
    });

    it('should loadParticipantData on get address error', () => {
        let groupId = 44;
        let groupParticipantId = 42;
        let participant = MockTestData.getAParticipantsArray()[1];
        comp['groupId'] = groupId;
        comp['groupParticipantId'] = groupParticipantId;
        comp['redirectUrl'] = '/small-group/1234';

        (mockParticipantService.getGroupParticipant).and.returnValue(Observable.of(participant));
        (mockAddressService.getPartialPersonAddress).and.returnValue(Observable.throw({error: 'nooooo'}));
        (mockParticipantService.getAllParticipantsOfRoleInGroup).and.returnValue(Observable.of(MockTestData.getAParticipantsArray()));

        comp['loadParticipantData']();

        expect(comp['participant'].participantId).toBe(1);
        expect(comp['isValidAddress']).toBeFalsy();
        expect(mockStateService.setPageHeader).toHaveBeenCalledWith('Participant', '/small-group/1234');
        expect(mockStateService.setLoading).toHaveBeenCalledTimes(1);
    });

    it('should handle no participant found', () => {
        (mockParticipantService.getGroupParticipant).and.returnValue(Observable.of(null));
        (mockParticipantService.getAllParticipantsOfRoleInGroup).and.returnValue(Observable.of(MockTestData.getAParticipantsArray()));
        comp['redirectUrl'] = '/small-group/1234';

        comp['loadParticipantData']();

        expect(comp['participant']).toBeUndefined();
        expect(comp['isValidAddress']).toBeFalsy();
        expect(mockAddressService.getPartialPersonAddress).not.toHaveBeenCalled();
        expect(mockBlandPageService.goToDefaultError).toHaveBeenCalledWith('/small-group/1234');
    });

    it('should handle error on getGroupParticipant call', () => {
        (mockParticipantService.getGroupParticipant).and.returnValue(Observable.throw({error: 'noooo'}));
        comp['redirectUrl'] = '/small-group/1234';
        comp['loadParticipantData']();

        expect(mockBlandPageService.goToDefaultError).toHaveBeenCalledWith('/small-group/1234');
    });

    it('AddressValid should return true if full address is passed in', () => {
        comp['participantAddress'] = MockTestData.getAnAddress();
        let result = comp['isParticipantAddressValid']();
        expect(result).toBe(true);
    });

    it('AddressValid should return true if address has one of city, state, or zip is filled out', () => {
        let address: Address = MockTestData.getAnAddress();
        address.addressLine1 = null;
        address.addressLine2 = null;
        comp['participantAddress'] = address;

        let result = comp['isParticipantAddressValid']();
        expect(result).toBe(true);

        address.city = null;
        address.state = null;
        console.log(comp['participantAddress']);
        result = comp['isParticipantAddressValid']();
        expect(result).toBe(true);

        address.city = 'Trenton';
        address.zip = null;
        result = comp['isParticipantAddressValid']();
        expect(result).toBe(true);

        address.city = null;
        address.state = 'Ohio';
        result = comp['isParticipantAddressValid']();
        expect(result).toBe(true);
    });

    it('AddressValid should return false when there is no object or all of zip, city, and state are null', () => {
        comp['participantAddress'] = null;
        let result = comp['isParticipantAddressValid']();
        console.log('result 1: ' + result);
        expect(result).toBe(false);

        comp['participantAddress'] = undefined;
        result = comp['isParticipantAddressValid']();
        console.log('result 2: ' + result);
        expect(result).toBe(false);

        let address = MockTestData.getAnAddress();
        address.state = null;
        address.city = null;
        address.zip = null;
        comp['participantAddress'] = address;
        result = comp['isParticipantAddressValid']();
        console.log('result 3: ' + result);
        expect(result).toBe(false);
    });
});
