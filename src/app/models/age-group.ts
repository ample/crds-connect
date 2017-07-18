import { Attribute } from './attribute';

export class AgeGroup {
  attribute: Attribute;
  selected: boolean = false;

  constructor(attribute: Attribute) {
    this.attribute = attribute;
  }
}
