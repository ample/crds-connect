export class MapBoundingBox {

  upperLeftLat: number;
  upperLeftLng: number;
  bottomRightLat: number;
  bottomRightLng: number;

  constructor(upperLeftLat: number, upperLeftLng: number, bottomRightLat: number, bottomRightLng: number) {
    this.upperLeftLat = upperLeftLat;
    this.upperLeftLng = upperLeftLng;
    this.bottomRightLat = bottomRightLat;
    this.bottomRightLng = bottomRightLng;
  }

}
