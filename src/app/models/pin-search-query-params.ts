export class PinSearchQueryParams {

  userSearchAddress: string;
  finderType: string;
  contactId: string;
  lat: number;
  lng: number;
  upperLeftLat: string;
  upperLeftLng: string;
  bottomRightLat: string;
  bottomRightLng: string;

    constructor(userSearchAddress: string, finderType: string, contactId: string, lat: number, lng: number,
                upperLeftLat: string, upperLeftLng: string, bottomRightLat: string, bottomRightLng: string) {
      this.userSearchAddress = userSearchAddress;
      this.finderType = finderType;
      this.contactId = contactId;
      this.lat = lat;
      this.lng = lng;
      this.upperLeftLat = upperLeftLat;
      this.upperLeftLng = upperLeftLng;
      this.bottomRightLat = bottomRightLat;
      this.bottomRightLng = bottomRightLng;
    }

}