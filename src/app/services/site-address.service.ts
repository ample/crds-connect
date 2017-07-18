import { Injectable } from '@angular/core';

import { Address } from '../models/address';
import { AddMeToMapFormFields } from '../models/add-me-to-map-form-fields';
import { LookupTable } from '../models/lookup-table';
import { Pin, pinType } from '../models/pin';
import { PinSearchResultsDto } from '../models/pin-search-results-dto';

class BuildingAddress {
  addressLine1: string;
  locationName: string;
}

@Injectable()
export class SiteAddressService {

  readonly buildingAddresses: Array<BuildingAddress> = [
    {
      addressLine1: '3500 Madison Road',
      locationName: 'Oakley'
    },
    {
      addressLine1: '4450 Eastgate S Dr',
      locationName: 'Not Site Specific'
    },
    {
      addressLine1: '990 Reading Road Mason',
      locationName: 'Mason'
    },
    {
      addressLine1: '828 Heights Blvd',
      locationName: 'Florence'
    },
    {
      addressLine1: '8575 Bridgetown Road',
      locationName: 'West Side'
     },
    {
      addressLine1: '42 Calhoun Street',
      locationName: 'Uptown'
    },
     {
      addressLine1: '3500 Madison Road',
      locationName: 'Anywhere'
    },
    {
      addressLine1: '501 East High Street',
      locationName: 'Oxford'
    },
    {
      addressLine1: '4450 Eastgate S Dr',
      locationName: 'East Side'
    },
    {
      addressLine1: '1619 California Ave',
      locationName: 'Church of the Resurrection'
    },
    {
      addressLine1: '1696 Oxford Dr',
      locationName: 'Georgetown'
    },
    {
      addressLine1: '124 South Keeneland Dr',
      locationName: 'Richmond'
    },
    {
      addressLine1: '811 Brian Ave',
      locationName: 'Downtown'
    },
    {
      addressLine1: '4128 Todds Rd',
      locationName: 'Andover'
    }

  ];


  constructor() { }

  // Why Does this exist? This is not what is happening.
  public addAddressesToGatheringPins (srchResults: PinSearchResultsDto): PinSearchResultsDto {
    srchResults.pinSearchResults = this.addAddressesToSitePins(srchResults.pinSearchResults);
    return srchResults;
  }

  // This is what is happening.
  public addAddressesToSitePins (pins: Array<Pin>): Array<Pin> {

    let thisService = this;

    pins.forEach(function(pin) {
      if (pin.pinType === pinType.SITE) {
        pin = thisService.addAddressToGatheringPin(pin);
      }
    });

    return pins;
  }

  public addAddressToGatheringPin(pin: Pin) {
    let buildingAddress: BuildingAddress = this.buildingAddresses.find( add => add.locationName === pin.siteName );

    if (buildingAddress === undefined) {
      pin.address.addressLine1 = '';
    } else {
      pin.address.addressLine1 = buildingAddress.addressLine1;
    }

    return pin;
  }

}
