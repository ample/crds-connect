import { TestBed, inject, async } from '@angular/core/testing';

import { crdsOakleyCoords } from '../shared/constants';
import { GeoCoordinates } from '../models/geo-coordinates';
import { LocationService } from './location.service';

describe('Service: Location', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [LocationService]
    });
  });

  it('should create an instance', inject([LocationService], (service: any) => {
    expect(service).toBeTruthy();
  }));

  it('Should get the user\'s current position as a GeoCoordinates object', async(inject(
    [LocationService],
    (service) => {
      const resultObs = service.getCurrentPosition();

      resultObs.subscribe(res => {
        expect(res).toEqual(jasmine.any(GeoCoordinates));
      });
  })));

  it('Should get the default Crds-Oakley coordinates', inject([LocationService], (service: any) => {
    expect(service.getDefaultPosition()).toEqual(new GeoCoordinates(crdsOakleyCoords.lat, crdsOakleyCoords.long));
  }));

});
