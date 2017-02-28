export class Marker {
  lat: number;
  lng: number;
  type: string;
  id: number;

  constructor(lat: number, lng: number, type: string, id: number) {
    this.lat = lat;
    this.lng = lng;
    this.type = type;
    this.id = id;
  }
};
