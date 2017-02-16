import { TestBed, inject, async } from '@angular/core/testing';

import { crdsOakleyCoords } from '../shared/constants';
import { GeoCoordinates } from '../models/geo-coordinates';
import { SessionService } from './session.service';
import { UserLocationService } from './user-location.service';

describe('Service: User-Location', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [UserLocationService]
    });
  });

  it('should create an instance', inject([UserLocationService], (service: any) => {
    expect(service).toBeTruthy();
  }));

  it('Should get the user\'s current position as a GeoCoordinates object', async(inject(
    [UserLocationService],
    (service) => {
      const resultObs = service.getCurrentPosition();

      resultObs.subscribe(res => {
        expect(res).toEqual(jasmine.any(GeoCoordinates));
      });
  })));

  it('Should get the default Crds-Oakley coordinates', inject([UserLocationService], (service: any) => {
    expect(service.getDefaultPosition()).toEqual(new GeoCoordinates(crdsOakleyCoords.lat, crdsOakleyCoords.long));
  }));

});
