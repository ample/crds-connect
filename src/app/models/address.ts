export class Address {

    addressId: number;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
    longitude: number;
    latitude: number;

    constructor(addressId: number, addressLine1: string, addressLine2: string,
    city: string, zip: string, longitude: number, latitude: number) {
        this.addressId = addressId;
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.city = city;
        this.zip = zip;
        this.longitude = longitude;
        this.latitude = latitude;
    }
}
