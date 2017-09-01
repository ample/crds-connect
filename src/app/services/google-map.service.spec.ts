import { TestBed, async, inject } from '@angular/core/testing';

import { AppSettingsService } from './app-settings.service';
import { GoogleMapService } from './google-map.service';
import { Address, Group, MapBoundingBox, MapView, Pin, pinType } from '../models';
import { initialMapZoom, pinTargetGroups, zoomAdjustment, minZoom, maxZoom } from '../shared/constants';
import { MockTestData } from '../shared/MockTestData';

function generatePin(lat: number, lng: number, number: number): Pin {
  const pin = MockTestData.getAPin(number);
  pin.address.latitude = lat;
  pin.address.longitude = lng;
  pin.gathering.availableOnline = true; // Make the pin an online group
  return pin;
}

function testCalculateZoom(pins: Pin[], GoogleMapService: any) {
  // Parameters for calculateZoom:
  const initialLat: number = 39.159398;   // Crossroads Oakley
  const initialLng: number = -84.423367;  // Crossroads Oakley
  const viewtype: string = 'world';

  // Calculate the zoom and get the resulting pinsInBounds:
  const calculatedZoom: number = GoogleMapService['calculateZoom'](initialMapZoom, initialLat, initialLng, pins, viewtype);
  const mapParams: MapView = new MapView('testMapView', initialLat, initialLng, calculatedZoom);
  const geoBounds: MapBoundingBox = GoogleMapService['calculateGeoBounds'](mapParams);
  const pinsInBounds: Pin[] = GoogleMapService['getPinsInBounds'](geoBounds, pins);

  return [calculatedZoom, pinsInBounds];
}

describe('Service: Google Map', () => {
    let mockAppSettingsService;
    let pinsInBounds;
    let calculatedZoom;

    beforeEach(() => {
        mockAppSettingsService = jasmine.createSpyObj<AppSettingsService>('appSettingsService', ['isConnectApp']);
        TestBed.configureTestingModule({
        providers: [
          {provide: AppSettingsService, useValue: mockAppSettingsService},
          GoogleMapService
        ]});
    });

  describe('Testing in groups app mode', () => {
    //  Points:
    //  1. Point is close (zoom > 15)
    //  2. Point is far away (zoom < 3)
    //  3. Point is medium distance (3 < zoom < 15)
    //  4. Point is medium distance (3 < zoom < 15) but farther away than point 3
    // const pnt1 = generatePin(39.159398, -84.423367, 1);  // Crossroads Oakley
    // const pnt2 = generatePin(34.459205, 113.021052, 2);  // Shaolin Temple
    // const pnt3 = generatePin(39.146979, -84.445654, 3);  // Rookwood Commons
    // const pnt4 = generatePin(39.131080, -84.517784, 4);  // University of Cincinnati

    beforeEach(() => {
        //  Points:
        //  1. Point is close (zoom > 15)
        //  2. Point is far away (zoom < 3)
        //  3. Point is medium distance (3 < zoom < 15)
        //  4. Point is medium distance (3 < zoom < 15) but farther away than point 3
        this.pnt1 = generatePin(39.159398, -84.423367, 1);  // Crossroads Oakley
        this.pnt2 = generatePin(34.459205, 113.021052, 2);  // Shaolin Temple
        this.pnt3 = generatePin(39.146979, -84.445654, 3);  // Rookwood Commons
        this.pnt4 = generatePin(39.131080, -84.517784, 4);  // University of Cincinnati
    });

    it('should filter out online groups when calculating zoom', inject([GoogleMapService], (GoogleMapService: any) => {
      this.pnt2.gathering.availableOnline = false;  // Make the group an online group
      this.pnt3.address.latitude = undefined;       // Make the group's latitude invalid
      this.pnt4.address.longitude = undefined;      // Make the group's longitude invalid

      // Parameters for calculateZoom:
      const initialLat: number = 39.159398;   // Crossroads Oakley
      const initialLng: number = -84.423367;  // Crossroads Oakley
      const viewtype: string = 'world';
      const mapParams: MapView = new MapView('zoomCalcView', initialLat, initialLng, initialMapZoom);

      spyOn(GoogleMapService, 'calculateBestZoom');

      [calculatedZoom, pinsInBounds] = testCalculateZoom([this.pnt1, this.pnt2, this.pnt3, this.pnt4], GoogleMapService);
      expect(GoogleMapService['calculateBestZoom']).toHaveBeenCalledWith(mapParams, [this.pnt1], pinTargetGroups, {});
    }));

    //  Tests:
    //  1. Search does not match any points
    //      pop should not contain any points
    //      zoom should be 3
    //  2. Search matches point 1
    //     pop should contain the first point
    //     zoom should be 15
    //  3. Search matches point 2
    //     pop not contain any points
    //     zoom should be 3
    //  4. Search matches points 3 and 4
    //     pop should contain only point 3
    it('Should handle no pins', inject([GoogleMapService], (GoogleMapService: any) => {
      [calculatedZoom, pinsInBounds] = testCalculateZoom([], GoogleMapService);

      expect(calculatedZoom).toEqual(minZoom - zoomAdjustment);
      expect(pinsInBounds.length).toBe(0);
    }));

    it('Should not zoom in greater than 15', inject([GoogleMapService], (GoogleMapService: any) => {
      [calculatedZoom, pinsInBounds] = testCalculateZoom([this.pnt1], GoogleMapService);
      expect(calculatedZoom).toEqual(maxZoom - zoomAdjustment);
      expect(pinsInBounds).toEqual([this.pnt1]);
    }));

    it('Should not zoom out greater than 3', inject([GoogleMapService], (GoogleMapService: any) => {
      [calculatedZoom, pinsInBounds] = testCalculateZoom([this.pnt2], GoogleMapService);

      expect(calculatedZoom).toEqual(minZoom - zoomAdjustment);
      expect(pinsInBounds.length).toBe(0);
    }));

    it('Should not continue zooming out when it has already found a point', inject([GoogleMapService], (GoogleMapService: any) => {
      [calculatedZoom, pinsInBounds] = testCalculateZoom([this.pnt3, this.pnt4], GoogleMapService);

      expect(pinsInBounds).toEqual([this.pnt3]);
    }));
  });

  describe('Testing in connect app mode', () => {
    beforeEach(() => {
        mockAppSettingsService = jasmine.createSpyObj<AppSettingsService>('appSettingsService', ['isConnectApp']);
        // Mock isConnectApp to return that the app is Connect rather than Groups:
        mockAppSettingsService.isConnectApp.and.returnValue(true);
        TestBed.configureTestingModule({providers: [
          {provide: AppSettingsService, useValue: mockAppSettingsService},
          GoogleMapService
        ]});
    });


    //  Point Clusters:
    //  1. 5 points at medium distance (3 < zoom < 15)
    //  2. 5 points at medium distance (3 < zoom < 15) but farther away than cluster 1
    //  3. 1 point at medium distance (3 < zoom < 15) but farther away than cluster 2
    //  4. 1 point at far distance (zoom < 3)
    const cluster1 = [
      generatePin(39.146979, -84.445654, 11),  // Rookwood Commons
      generatePin(39.146979, -84.445655, 12),
      generatePin(39.146979, -84.445656, 13),
      generatePin(39.146979, -84.445657, 14),
      generatePin(39.146979, -84.445658, 15)
    ];

    const cluster2 = [
      generatePin(39.131080, -84.517784, 21),  // University of Cincinnati
      generatePin(39.131080, -84.517785, 22),
      generatePin(39.131080, -84.517786, 23),
      generatePin(39.131080, -84.517787, 24),
      generatePin(39.131080, -84.517788, 25)
    ];

    const cluster3 = [
      generatePin(39.170029, -84.751012, 31)   // Taylor High School
    ];

    const cluster4 = [
      generatePin(34.459205, 113.021052, 41)  // Shaolin Temple
    ];

    //  Tests:
    //  1.  Search matches clusters 1, 2, and 3
    //      pop contains only the points in clusters 1 and 2
    //  2.  Search matches clusters 1 and 4
    //      pop contains only the points in cluster 1
    it('Should stop zooming out after 10 pins are found', inject([GoogleMapService], (GoogleMapService: any) => {
      [calculatedZoom, pinsInBounds] = testCalculateZoom([...cluster1, ...cluster2, ...cluster3], GoogleMapService);
      expect(pinsInBounds).toEqual([...cluster1, ...cluster2]);
    }));

    it('Should stop at max zoom, even if target number of pins has not been found', inject([GoogleMapService], (GoogleMapService: any) => {
      [calculatedZoom, pinsInBounds] = testCalculateZoom([...cluster1, ...cluster4], GoogleMapService);

      expect(pinsInBounds).toEqual(cluster1);
    }));
  });
});
