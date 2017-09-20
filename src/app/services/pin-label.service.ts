import { Injectable, NgZone } from '@angular/core';

import { PinService } from './pin.service';
import { StateService } from './state.service';

import { Pin, pinType } from '../models/pin';
import { PinLabelData } from '../models/pin-label-data';

@Injectable()
export class PinLabelService {
  constructor (private pinService: PinService, private state: StateService) {}

  public createPinLabelDataJsonString(pin: Pin): string {
    return JSON.stringify(this.createPinLabelData(pin));
  }

  public createPinLabelData(pin: Pin): PinLabelData {
    const pinLabelData: PinLabelData = new PinLabelData(
      this.getFirstNameOrUndefinedIfSite(pin),
      this.getLastInitialOrUndefinedIfSite(pin),
      this.getSiteNamelOrUndefinedIfNotSite(pin),
      this.isHost(pin),
      this.isMe(pin),
      pin.pinType
    );

    return pinLabelData;
  }

  public capitalizeFirstLetter(string: string) {
    const isStringEmptyOrNull = string === undefined || string === null || string === '';

    if (isStringEmptyOrNull) {
      return '';
    } else {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  public getFirstNameOrUndefinedIfSite(pin: Pin) {
    return pin.pinType !== pinType.SITE ? this.capitalizeFirstLetter(pin.firstName) : undefined;
  }

  public getLastInitialOrUndefinedIfSite(pin: Pin) {
    return pin.pinType !== pinType.SITE ? this.capitalizeFirstLetter((pin.lastName.substring(0, 1)) + '.') : undefined;
  }

  public getSiteNamelOrUndefinedIfNotSite(pin: Pin) {
    return pin.pinType === pinType.SITE ? 'Crossroads ' + this.capitalizeFirstLetter(pin.siteName) : undefined;
  }

  public isHost(pin: Pin): boolean {
    return pin.pinType === pinType.GATHERING;
  }

  public isHostingAny(myPins: Array<Pin>): boolean {
    if (!myPins) {
      return false;
    }

    if (this.state.getMyViewOrWorldView() === 'my') {
      for (let pin of myPins) {
        if (this.isHost(pin)) {
          return true;
        }
      }
    }

    return false;
  }

  public isMe(pin: Pin): boolean {
    const isPinASite: boolean = pin.pinType === pinType.SITE;
    const doesUserOwnPin: boolean = this.pinService.doesLoggedInUserOwnPin(pin);
    const isMe: boolean = !isPinASite && doesUserOwnPin;

    return isMe;
  }
}
