import { TestBed, async, inject } from '@angular/core/testing';

import { AppSettingsService } from './app-settings.service';
import { GoogleMapService } from './google-map.service';
import { Address, Group, MapBoundingBox, MapView, Pin, pinType } from '../models';
import { zoomAdjustment } from '../shared/constants';

function generatePin(lat: number, lng: number, name: string): Pin {
  const newAddress = {
    addressId: 1,
    addressLine1: 'foo',
    addressLine2: 'foo',
    city: 'foo',
    state: 'foo',
    foreignCountry: 'foo',
    county: 'foo',
    zip: 'foo',
    latitude: lat,
    longitude: lng
  };

  return {
    firstName: name,
    lastName: 'foo',
    siteName: 'foo',
    emailAddress: 'foo',
    contactId: 1,
    participantId: 1,
    hostStatus: 1,
    gathering: new Group(),
    address: newAddress,
    pinType: pinType.PERSON,
    proximity: 1,
    householdId: 1,
    updateHomeAddress: false,
    iconUrl: 'foo',
    title: 'foo'
  };
}

function testCalculateZoom(pins: Pin[], GoogleMapService: any) {
  // Parameters for calculateZoom:
  const initialZoom: number = 10;
  const initialLat: number = 39.159398;   // Crossroads Oakley
  const initialLng: number = -84.423367;  // Crossroads Oakley
  const viewtype: string = 'world';

  // Calculate the zoom and get the resulting pinsInBounds:
  const calculatedZoom: number = GoogleMapService['calculateZoom'](initialZoom, initialLat, initialLng, pins, viewtype);
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
        TestBed.configureTestingModule({providers: [
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
    const pnt1 = generatePin(39.159398, -84.423367, 'pnt1');  // Crossroads Oakley
    const pnt2 = generatePin(34.459205, 113.021052, 'pnt2');  // Shaolin Temple
    const pnt3 = generatePin(39.146979, -84.445654, 'pnt3');  // Rookwood Commons
    const pnt4 = generatePin(39.131080, -84.517784, 'pnt4');  // University of Cincinnati

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

      expect(calculatedZoom).toEqual(3 - zoomAdjustment);  // Subtract .25 due to extra .25 zoom out applied in calculateZoom
      expect(pinsInBounds.length).toBe(0);
    }));

    it('Should not zoom in greater than 15', inject([GoogleMapService], (GoogleMapService: any) => {
      [calculatedZoom, pinsInBounds] = testCalculateZoom([pnt1], GoogleMapService);
      expect(calculatedZoom).toEqual(15 - zoomAdjustment);  // Subtract .25 due to extra .25 zoom out applied in calculateZoom
      expect(pinsInBounds).toEqual([pnt1]);
    }));

    it('Should not zoom out greater than 3', inject([GoogleMapService], (GoogleMapService: any) => {
      [calculatedZoom, pinsInBounds] = testCalculateZoom([pnt2], GoogleMapService);

      expect(calculatedZoom).toEqual(3 - zoomAdjustment);  // Subtract .25 due to extra .25 zoom out applied in calculateZoom
      expect(pinsInBounds.length).toBe(0);
    }));

    it('Should not continue zooming out when it has already found a point', inject([GoogleMapService], (GoogleMapService: any) => {
      [calculatedZoom, pinsInBounds] = testCalculateZoom([pnt3, pnt4], GoogleMapService);

      expect(pinsInBounds).toEqual([pnt3]);
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
      generatePin(39.146979, -84.445654, 'cluster1Pin1'),  // Rookwood Commons
      generatePin(39.146979, -84.445655, 'cluster1Pin2'),
      generatePin(39.146979, -84.445656, 'cluster1Pin3'),
      generatePin(39.146979, -84.445657, 'cluster1Pin4'),
      generatePin(39.146979, -84.445658, 'cluster1Pin5')
    ];

    const cluster2 = [
      generatePin(39.131080, -84.517784, 'cluster2Pin1'),  // University of Cincinnati
      generatePin(39.131080, -84.517785, 'cluster2Pin2'),
      generatePin(39.131080, -84.517786, 'cluster2Pin3'),
      generatePin(39.131080, -84.517787, 'cluster2Pin4'),
      generatePin(39.131080, -84.517788, 'cluster2Pin5')
    ];

    const cluster3 = [
      generatePin(39.170029, -84.751012, 'cluster3Pin1')   // Taylor High School
      // generatePin(39.144860, -84.618615, 'cluster3Pin1')   // Western Hills Plaza
    ];

    const cluster4 = [
      generatePin(34.459205, 113.021052, 'cluster4Pin1')  // Shaolin Temple
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
