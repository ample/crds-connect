import { TestBed, async, inject } from '@angular/core/testing';
import { MockTestData } from '../shared/MockTestData';
import { PinLabelService } from './pin-label.service';
import { Pin, PinLabelData, pinType, Address } from '../models/';
import { PinService } from './pin.service';
import { StateService } from './state.service';

describe('PinLabelService', () => {
  let service;
  let mockPinService, mockStateService;
  const mockAddress = new Address(123, 'Test St', null, 'TesVille', 'ZZ', '12345', 0, 0, 'US', 'County');
  const mockPin =
    new Pin('bob', 'smith', 'bobby@bob.com', 111, 2122, mockAddress, 0, null, '', pinType.PERSON, 0, 999);

  const mockLowerCaseName: string = 'bob';
  const mockUpperCaseName: string = 'Bob';

  const mockPinLabel: any = {
    firstName: 'Bob',
    lastInitial: 'S.',
    siteName: undefined,
    isHost: false,
    isMe: false,
    pinType: pinType.PERSON
  };

  beforeEach(() => {
    mockPinService = jasmine.createSpyObj<PinService>('pinService', ['doesLoggedInUserOwnPin']);
    mockStateService = jasmine.createSpyObj<StateService>('state', ['getMyViewOrWorldView']);
    TestBed.configureTestingModule({
      providers: [
        PinLabelService,
        { provide: PinService, useValue: mockPinService },
        { provide: StateService, useValue: mockStateService }

      ]
    });
  });

  it('should create a service instance', inject([PinLabelService], (labelService: PinLabelService) => {
    expect(labelService).toBeTruthy();
  }));

  it('should capitalize the first letter of a name', inject([PinLabelService], (labelService: PinLabelService) => {
    let capitalizedName: string = labelService.capitalizeFirstLetter(mockLowerCaseName);
    expect(capitalizedName).toEqual(mockUpperCaseName);
  }));

  it('should create pin label data from a pin object', inject([PinLabelService], (labelService: PinLabelService) => {
    (mockPinService.doesLoggedInUserOwnPin).and.returnValue(false);
    let pinLabel: PinLabelData = labelService.createPinLabelData(mockPin);
    expect(pinLabel.firstName).toEqual(mockPinLabel.firstName);
    expect(pinLabel.lastInitial).toEqual(mockPinLabel.lastInitial);
    expect(pinLabel.siteName).toEqual(mockPinLabel.siteName);
    expect(pinLabel.isHost).toEqual(mockPinLabel.isHost);
    expect(pinLabel.isMe).toEqual(mockPinLabel.isMe);
    expect(pinLabel.pinType).toEqual(mockPinLabel.pinType);
  }));

  it('should return true for host', inject([PinLabelService, StateService], (labelService: PinLabelService, state: StateService) => {
    (mockStateService.getMyViewOrWorldView).and.returnValue('my');
    let pins = MockTestData.getAPinSearchResults(2).pinSearchResults;
    let pinsHost = MockTestData.getAPinSearchResultsGatheringHost(2).pinSearchResults;
    pins = pins.concat(pinsHost);
    let isHostTrue = labelService.isHostingAny(pins);

    expect(isHostTrue).toEqual(true);
  }));

  it('should return false for host', inject([PinLabelService, StateService], (labelService: PinLabelService) => {
    (mockStateService.getMyViewOrWorldView).and.returnValue('my');
    let pins = MockTestData.getAPinSearchResults(2).pinSearchResults;
    let isHostTrue = labelService.isHostingAny(pins);

    expect(isHostTrue).toEqual(false);
  }));

});
