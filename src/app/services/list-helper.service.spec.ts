import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { Address } from '../models/address';
import { ListHelperService } from '../services/list-helper.service';
import { Pin, pinType } from '../models/pin';
import { UserState } from '../shared/constants';

describe('Service: Add me to the Map Helper', () => {

    const mockContactIdOnMap: number  = 111;
    const mockContactIdNotInPinArray: number   = 333;
    const mockUndefinedContactId: number = undefined;
    const mockAddress = new Address(123, 'Test St', null, 'TesVille', 'ZZ', '12345', 0, 0);
    const mockPin = new Pin('Bob', 'Smith', 'bobby@bob.com', 111, 222,
                            mockAddress, 0, null, 9999, true, '', pinType.PERSON, 1);
    const mockPinArray: Array<Pin> = [mockPin];
    const mockEmptyPinArray: Array<Pin> = [];


    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule
            ],
            providers: [ListHelperService]
        });
    });

    it('should state that user IS logged in and on the map', inject([ListHelperService], (service: any) => {
      let userState: UserState = service.getUserMapState(mockContactIdOnMap, mockPinArray);
      expect(userState).toEqual(UserState.LoggedIn_OnMap);
    }));

    it('should state that user IS logged in and NOT on the map', inject([ListHelperService], (service: any) => {
      let userState: UserState = service.getUserMapState(mockContactIdNotInPinArray, mockPinArray);
      expect(userState).toEqual(UserState.LoggedIn_NotOnMap);
    }));

    it('should state that user is NOT logged in', inject([ListHelperService], (service: any) => {
        let userState: UserState = service.getUserMapState(mockContactIdNotInPinArray, mockPinArray);
        expect(userState).toEqual(UserState.LoggedIn_NotOnMap);
    }));

    it('should state that user user IS logged in and NOT on map if pins are an empty array',
        inject([ListHelperService], (service: any) => {
        let userState: UserState = service.getUserMapState(mockContactIdNotInPinArray, mockEmptyPinArray);
        expect(userState).toEqual(UserState.LoggedIn_NotOnMap);
    }));

});
