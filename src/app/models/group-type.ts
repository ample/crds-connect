import { Attribute } from './attribute';

export class GroupType {
  attribute: Attribute;
  selected: boolean = false;

  constructor(attribute: Attribute) {
    this.attribute = attribute;
  }
}