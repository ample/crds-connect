import { Address } from './address';

export class HostRequestDto {

  public contactId: number;
  public address: Address;
  public isHomeAddress: boolean;
  public contactNumber: string;
  public groupDescription: string;

  constructor(contactId: number, address: Address, isHomeAddress: boolean, contactNumber: string, groupDescription: string) {
    this.contactId = contactId;
    this.address = address;
    this.isHomeAddress = isHomeAddress;
    this.contactNumber = contactNumber;
    this.groupDescription = groupDescription;
  }
}
