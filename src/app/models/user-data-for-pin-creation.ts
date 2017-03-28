import { Address } from './address';
import { User } from './user';

export class UserDataForPinCreation extends User {

    public contactId: number;
    public participantId: number;
    public householdId: number;

    constructor(contactId: number, participantId: number, householdId: number
                , first_name: string, last_name: string, email: string, address: Address) {
        super(first_name, last_name, email, null, address);
        this.contactId = contactId;
        this.participantId = participantId;
        this.householdId = householdId;
    }
}
