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

    constructor(first_name: string, last_name: string, email: string, contactId: number, participantId: number, 
                hostStatus: number, gathering: Group, address: Address) {
        this.firstname = first_name;
        this.lastname = last_name;
        this.emailAddress = email;
        this.contactId = contactId;
        this.participantId = participantId;
        this.hostStatus = hostStatus;
        this.gathering = gathering;
    }
}
