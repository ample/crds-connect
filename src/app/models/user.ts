import { Person } from './person';
import { Address } from './address';

export class User extends Person {
  public firstname: string;
  public lastname: string;
  public email: string;
  public password: string;
  public address: Address;

  constructor(first_name?: string, last_name?: string, email?: string, password?: string, address?: Address) {
    super(first_name, last_name, email);
    this.password = password;
    this.address = address;
  }
}
