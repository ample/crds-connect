import { Address } from './address';

export class UserDataForPinCreation {

    contactId: number;
    participantId: number;
    householdId: number;
    firstname: string;
    lastname: string;
    email: string;
    address: Address;

    constructor(contactId: number, participantId: number, householdId: number
                , first_name: string, last_name: string, email: string, address: Address) {
        this.contactId = contactId;
        this.participantId = participantId;
        this.householdId = householdId;
        this.firstname = first_name;
        this.lastname = last_name;
        this.email = email;
        this.address = address;
    }
}
