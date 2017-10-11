import { Injectable } from '@angular/core';

import { Address } from '../models/address';
import { GeoCoordinates } from '../models/geo-coordinates';
import { Pin, pinType } from '../models/pin';

import { AppType, earthsRadiusInMiles } from '../shared/constants';

import * as _ from 'lodash';

@Injectable()
export class PinCollectionProcessingService {
  constructor() {}

  public reSortBasedOnCenterCoords(pinSearchResults: Pin[], coords: GeoCoordinates) {
    _.forEach(pinSearchResults, pin => {
      pin.proximity = this.calculateProximity(coords, pin.address);
    });

    return this.sortPins(pinSearchResults);
  }

  public sortPinsAndRemoveDuplicates(pinSearchResults: Pin[]): Pin[] {
    const sortedPins: Pin[] = this.sortPins(pinSearchResults);
    const sortedAndUniquePins: Pin[] = this.removeDuplicatePins(sortedPins);

    return sortedAndUniquePins;
  }

  private calculateProximity(coords: GeoCoordinates, address: Address) {
    const pi = Math.PI;
    // convert degrees to radians
    const a1 = coords.lat * (pi / 180);
    const b1 = coords.lng * (pi / 180);
    const a2 = address.latitude * (pi / 180);
    const b2 = address.longitude * (pi / 180);
    return (
      Math.acos(
        Math.cos(a1) * Math.cos(b1) * Math.cos(a2) * Math.cos(b2) +
          Math.cos(a1) * Math.sin(b1) * Math.cos(a2) * Math.sin(b2) +
          Math.sin(a1) * Math.sin(a2)
      ) * earthsRadiusInMiles
    );
  }

  private sortPins(pinSearchResults: Pin[]): Pin[] {
    const sortedPinSearchResults: Pin[] = pinSearchResults.sort((p1: Pin, p2: Pin) => {
      if (p1.proximity !== p2.proximity) {
        return p1.proximity - p2.proximity; // asc
      } else if (p1.firstName && p2.firstName && p1.firstName !== p2.firstName) {
        return p1.firstName.localeCompare(p2.firstName); // asc
      } else if (p1.lastName && p2.lastName && p1.lastName !== p2.lastName) {
        return p1.lastName.localeCompare(p2.lastName); // asc
      } else {
        return p2.pinType - p1.pinType; // des
      }
    });

    return sortedPinSearchResults;
  }

  private removeDuplicatePins(pinSearchResults: Pin[]): Pin[] {
    let lastIndex = -1;

    const uniquePins: Pin[] = pinSearchResults.filter((p, index, self) => {
      const isGroupOrGatheringPin: boolean = p.pinType === pinType.GATHERING || p.pinType === pinType.SMALL_GROUP;

      if (isGroupOrGatheringPin) {
        lastIndex = -1;
        return true;
      } else if (lastIndex === -1) {
        lastIndex = index;
        return true;
      } else {
        const pl = self[lastIndex];
        const test = p.proximity !== pl.proximity || p.firstName !== pl.firstName || p.lastName !== pl.lastName;
        if (test) {
          lastIndex = index;
        }
        return test;
      }
    });

    return uniquePins;
  }
}
