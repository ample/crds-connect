import { GeoCoordinates } from '../models/geo-coordinates';
import { MapBoundingBox } from '../models/map-bounding-box';
import { AppType } from '../shared/constants'

export class PinSearchQueryParams {
  userLocationSearchString: string;
  userKeywordSearchString: string;
  userFilterString: string;
  isMyStuff: boolean;
  finderType: AppType;
  contactId: number;
  centerGeoCoords: GeoCoordinates;
  boundingBox: MapBoundingBox;

  constructor(userLocationSearchString: string, userKeywordSearchString: string
              , isMyStuff: boolean, finderType: AppType, contactId: number, centerGeoCoords: GeoCoordinates
              , boundingBox: MapBoundingBox, userFilterString: string) {
    this.userLocationSearchString = userLocationSearchString;
    this.userKeywordSearchString = userKeywordSearchString;
    this.userFilterString = userFilterString;
    this.isMyStuff = isMyStuff;
    this.finderType = finderType;
    this.contactId = contactId;
    this.centerGeoCoords = centerGeoCoords;
    this.boundingBox = boundingBox;
  }
}
