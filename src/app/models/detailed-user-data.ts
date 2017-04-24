import { Address } from '../models/address';

export class DetailedUserData {

  public contactId: number;
  public firstName: string;
  public lastName: string;
  public homePhone: string;
  public mobilePhone: string;
  public emailAddress: string;
  public address: Address;

  constructor(contactId: number, firstName: string, lastName: string, homePhone: string, mobilePhone: string, emailAddress: string, address: Address) {
    this.contactId = contactId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.homePhone = homePhone;
    this.mobilePhone = mobilePhone;
    this.emailAddress = emailAddress;
    this.address = address;
  }
}
