import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { Address } from '../models/address';
import { AppSettingsService } from '../services/app-settings.service';
import { Pin, pinType } from '../models/pin';
import { AppType, appType, LeadershipApplicationType } from '../shared/constants';

describe('Service: App Settings', () => {
    const mockContactIdOnMap: number  = 111;
    const mockContactIdNotInPinArray: number   = 333;
    const mockUndefinedContactId: number = undefined;
    const mockAddress = new Address(123, 'Test St', null, 'TesVille', 'ZZ', '12345', 0, 0, 'US', 'County');
    const mockPin = new Pin('Bob', 'Smith', 'bobby@bob.com', 111, 222,
                            mockAddress, 0, null, '', pinType.PERSON, 0, 999);
    const mockPinArray: Array<Pin> = [mockPin];
    const mockEmptyPinArray: Array<Pin> = [];
let
 mockRouter;
 mockRouter = jasmine.createSpyObj<Router>('router', ['navigate', 'navigateByUrl']);
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule
            ],
            providers: [AppSettingsService,
            { provide: Router, useValue: mockRouter }]
        });
    });

    it('should set correct settings for Connect', inject([AppSettingsService], (service: any) => {
      console.log(service);
      service.setAppSettings(appType.Connect);
      expect(service.finderType).toEqual(appType.Connect);

      expect(service.leadershipApplicationType).toEqual(LeadershipApplicationType.ANYWHERE_HOST);
      expect(service.appRoute).toEqual('/');
      expect(service.placeholderTextForSearchBar).toEqual('Address...');
      expect(service.myStuffName).toEqual('My connections');
      expect(service.noSearchResultsContent).toEqual('noConnectSearchResults');
      expect(service.myStuffNotFoundContent).toEqual('myConnectionsNotFound');
      expect(service.leaderTitle).toEqual('Host');
    }));

    it('should set correct settings for Groups', inject([AppSettingsService], (service: any) => {
      service.setAppSettings(appType.Groups);
      expect(service.finderType).toEqual(appType.Groups);

      expect(service.leadershipApplicationType).toEqual(LeadershipApplicationType.GROUP_LEADER);
      expect(service.appRoute).toEqual('/groupsv2');
      expect(service.placeholderTextForSearchBar).toEqual('Keyword...');
      expect(service.myStuffName).toEqual('My groups');
      expect(service.noSearchResultsContent).toEqual('noGroupsSearchResults');
      expect(service.myStuffNotFoundContent).toEqual('myGroupsNotFound');
      expect(service.leaderTitle).toEqual('Leader');
    }));
});
