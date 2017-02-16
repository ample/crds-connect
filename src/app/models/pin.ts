import { Address } from './address';
import { Group } from './group';

export class Pin {

    firstname: string;
    lastname: string;
    emailAddress: string;
    contactId: number;
    participantId: number;
    hostStatus: number;
    gathering: Group;
    address: Address;
    householdId: number;

    constructor(first_name: string, last_name: string, email: string, contactId: number, participantId: number,
                address: Address, hostStatus: number, gathering: Group, householdId: number) {
        this.firstname = first_name;
        this.lastname = last_name;
        this.emailAddress = email;
        this.contactId = contactId;
        this.participantId = participantId;
        this.address =  address;
        this.hostStatus = hostStatus;
        this.gathering = gathering;
        this.householdId = householdId;
    }
}
