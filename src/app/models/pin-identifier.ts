import { pinType } from './pin';

export class PinIdentifier {
  type: pinType;
  id: number;

  constructor(type: pinType, id: number) {
    this.type = type;
    this.id = id;
  }
}
