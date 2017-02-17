export class AddMeToMapFormFields {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;

    constructor(addressLine1: string, addressLine2: string,city: string, state:string, zip: string) {
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.city = city;
        this.state = state;
        this.zip = zip;
    }
}

