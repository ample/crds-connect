import { Address } from './address';
import { Group } from './group';

export enum pinType {PERSON = 1, GATHERING = 2, SITE = 3 };

export class Pin {
    firstName: string;
    lastName: string;
    siteName: string;
    emailAddress: string;
    contactId: number;
    participantId: number;
    hostStatus: number;
    gathering: Group;
    address: Address;
    householdId: number;
    isFormDirty: boolean;
    pinType: pinType;
    proximity: number;

    constructor(first_name: string, last_name: string, email: string, contactId: number, participantId: number,
                address: Address, hostStatus: number, gathering: Group, householdId: number, isFormDirty: boolean
                , siteName: string, pinType: pinType, proximity: number ) {

        this.firstName = first_name;
        this.lastName = last_name;
        this.siteName = siteName;
        this.emailAddress = email;
        this.contactId = contactId;
        this.participantId = participantId;
        this.address =  address;
        this.hostStatus = hostStatus;
        this.gathering = gathering;
        this.householdId = householdId;
        this.isFormDirty = isFormDirty;
        this.pinType = pinType;
        this.proximity = proximity;
    }

    public static overload_Constructor_One(){
        return new Pin(null, null, null, null, null, null, null, null, null, null, null, null, null);
    }
}
