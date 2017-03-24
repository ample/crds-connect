import { GeoCoordinates } from './geo-coordinates';

export class SearchOptions {

  coords: GeoCoordinates;
  address: string;

  constructor(address: string, lat: number, lng: number) {
    this.coords = new GeoCoordinates(lat,lng);
    this.address = address;
  }

}
