import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { Address } from '../models/address';
import { AppSettingsService } from '../services/app-settings.service';
import { Pin, pinType } from '../models/pin';
import { AppType } from '../shared/constants';

fdescribe('Service: App Settings', () => {

    const mockContactIdOnMap: number  = 111;
    const mockContactIdNotInPinArray: number   = 333;
    const mockUndefinedContactId: number = undefined;
    const mockAddress = new Address(123, 'Test St', null, 'TesVille', 'ZZ', '12345', 0, 0, 'US', 'County');
    const mockPin = new Pin('Bob', 'Smith', 'bobby@bob.com', 111, 222,
                            mockAddress, 0, null, '', pinType.PERSON, 0, 999);
    const mockPinArray: Array<Pin> = [mockPin];
    const mockEmptyPinArray: Array<Pin> = [];


    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule
            ],
            providers: [AppSettingsService]
        });
    });

    it('should set correct settings for Connect', inject([AppSettingsService], (service: any) => {
      service.setAppSettings(AppType.Connect);
      expect(service.finderType).toEqual('CONNECT');
    }));

    it('should set correct settings for Groups', inject([AppSettingsService], (service: any) => {
      service.setAppSettings(AppType.Groups);
      expect(service.finderType).toEqual('SMALL_GROUPS');
    }));
});
