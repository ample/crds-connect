import { Pin } from './pin';
import { GeoCoordinates } from './geo-coordinates';

export class PinSearchResultsDto {
    centerLocation: GeoCoordinates;
    pinSearchResults: Pin[];

    constructor(center_location: GeoCoordinates, pin_Search_Results: Pin[]) {
        this.centerLocation = center_location;
        this.pinSearchResults = pin_Search_Results;
    }
}