import { GeoCoordinates } from './geo-coordinates';

export class SearchOptions {

  coords: GeoCoordinates;
  search: string;

  constructor(search: string, lat: number, lng: number) {
    this.coords = new GeoCoordinates(lat,lng);
    this.search = search;
  }

}
