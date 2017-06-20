import { GeoCoordinates } from '../models/geo-coordinates';
import { MapBoundingBox } from '../models/map-bounding-box';

export class PinSearchQueryParams {

  userSearchString: string;
  isAddressSearch: boolean;
  isMyStuff: boolean;
  finderType: string;
  contactId: number;
  centerGeoCoords: GeoCoordinates;
  boundingBox: MapBoundingBox;

  constructor(userSearchString: string, isAddressSearch: boolean, isMyStuff: boolean, finderType: string,
              contactId: number, centerGeoCoords: GeoCoordinates, boundingBox: MapBoundingBox) {

    this.userSearchString = userSearchString;
    this.isAddressSearch = isAddressSearch;
    this.isMyStuff = isMyStuff;
    this.finderType = finderType;
    this.contactId = contactId;
    this.centerGeoCoords = centerGeoCoords;
    this.boundingBox = boundingBox;
  }

}
