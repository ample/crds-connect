/*
 * Testing a Service
 * More info: https://angular.io/docs/ts/latest/guide/testing.html
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { PinCollectionProcessingService } from './pin-collection-processing.service';

import { MockTestData } from '../shared/MockTestData';

import { GeoCoordinates, Pin } from '../models';

describe('PinCollectionProcessingService', () => {
  let service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PinCollectionProcessingService]
    });
  });

  it(
    'should re-sort by center coords',
    inject([PinCollectionProcessingService], (service: PinCollectionProcessingService) => {
      let pins: Pin[] = new Array();
      pins.push(MockTestData.getAPin(3));
      pins.push(MockTestData.getAPin(1));
      pins.push(MockTestData.getAPin(2));
      const centerCoords = new GeoCoordinates(0, 0);

      const reSortedPins = service.reSortBasedOnCenterCoords(pins, centerCoords);
      expect(reSortedPins[0].contactId).toBe(1);
      expect(reSortedPins[1].contactId).toBe(2);
      expect(reSortedPins[2].contactId).toBe(3);
    })
  );
});
