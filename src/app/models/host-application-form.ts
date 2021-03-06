import { Address } from './address';

export class HostApplicatonForm {

  public contactId: number;
  public homeAddress: Address;
  public isHomeAddress: boolean;
  public groupAddress: Address;
  public contactNumber: string;
  public gatheringDescription: string;

  constructor(contactId: number, homeAddress: Address, isHomeAddress: boolean,
              groupAddress: Address, contactNumber: string, gatheringDescription: string) {
    this.contactId = contactId;
    this.homeAddress = homeAddress;
    this.isHomeAddress = isHomeAddress;
    this.groupAddress  = groupAddress;
    this.contactNumber = contactNumber;
    this.gatheringDescription = gatheringDescription;
  }
}

