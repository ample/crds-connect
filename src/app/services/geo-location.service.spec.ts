import { TestBed, inject, async } from '@angular/core/testing';

import { crdsOakleyCoords, centerOfTheUsCoords } from '../shared/constants';
import { GeoCoordinates } from '../models/geo-coordinates';
import { GeoLocationService } from './geo-location.service';
import { StateService } from './state.service';

describe('Service: GeoLocation', () => {
  let mockStateService;
  beforeEach(() => {
    spyOn(window, 'setTimeout');
    mockStateService = jasmine.createSpyObj<StateService>('state', ['setUseZoom'])
    TestBed.configureTestingModule({
        providers: [
          GeoLocationService,
        { provide: StateService, useValue: mockStateService }
        ]
    });
  });

  it('should create an instance', inject([GeoLocationService], (service: any) => {
    expect(service).toBeTruthy();
  }));

  it('Should get the user\'s current position as a GeoCoordinates object', inject(
    [GeoLocationService],
    (service) => {
      const resultObs = service.getCurrentPosition();
      resultObs.subscribe(res => {
        expect(res).toEqual(jasmine.any(GeoCoordinates));
      });
  }));

  it('Should get the default us center coordinates', inject([GeoLocationService], (service: any) => {
    expect(service.getDefaultPosition()).toEqual(new GeoCoordinates(centerOfTheUsCoords.lat, centerOfTheUsCoords.lng));
    expect(mockStateService.setUseZoom).toHaveBeenCalledWith(service.wholeUsZoomLevel);
  }));

});
