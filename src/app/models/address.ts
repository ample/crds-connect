export class Address {
    addressId: number;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    foreignCountry: string;
    county: string;
    zip: string;
    longitude: number;
    latitude: number;

    constructor(addressId: number, addressLine1: string, addressLine2: string,
                city: string, state: string, zip: string, longitude: number, latitude: number, foreignCountry: string, county: string) {
        this.addressId = addressId;
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.city = city;
        this.state = state;
        this.county = county;
        this.foreignCountry = foreignCountry;
        this.zip = zip;
        this.longitude = longitude;
        this.latitude = latitude;
    }
}
