import { GeoCoordinates } from '../models/geo-coordinates';
import { MapBoundingBox } from '../models/map-bounding-box';

export class PinSearchQueryParams {

  userSearchString: string;
  userFilterString: string;
  isAddressSearch: boolean;
  isMyStuff: boolean;
  finderType: string;
  contactId: number;
  centerGeoCoords: GeoCoordinates;
  boundingBox: MapBoundingBox;

  constructor(userSearchString: string, isAddressSearch: boolean, isMyStuff: boolean, finderType: string,
              contactId: number, centerGeoCoords: GeoCoordinates, boundingBox: MapBoundingBox, userFilterString: string) {

    this.userSearchString = userSearchString;
    this.userFilterString = userFilterString;
    this.isAddressSearch = isAddressSearch;
    this.isMyStuff = isMyStuff;
    this.finderType = finderType;
    this.contactId = contactId;
    this.centerGeoCoords = centerGeoCoords;
    this.boundingBox = boundingBox;
  }

}
