import { Injectable, NgZone } from '@angular/core';

import { PinService } from './pin.service';
import { StateService } from './state.service';

import { Pin, pinType } from '../models/pin';
import { PinLabelData } from '../models/pin-label-data';

@Injectable()
export class PinLabelService {


  constructor (private pinHlpr: PinService, private state: StateService) {}

  createPinLabelDataJsonString(pin: Pin): string {
    return JSON.stringify(this.createPinLabelData(pin));
  }

  createPinLabelData(pin: Pin): PinLabelData {
    let pinLabelData: PinLabelData = new PinLabelData(
      this.getFirstNameOrUndefinedIfSite(pin),
      this.getLastInitialOrUndefinedIfSite(pin),
      this.getSiteNamelOrUndefinedIfNotSite(pin),
      this.isHost(pin),
      this.isMe(pin),
      pin.pinType
    );

    return pinLabelData;
  }

  public capitalizeFirstLetter(string) {

    let isStringEmptyOrNull = string === undefined || string === null || string === '';

    if (isStringEmptyOrNull) {
      return '';
    } else {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  public getFirstNameOrUndefinedIfSite(pin: Pin) {

    let firstName: string = undefined;

    if (pin.pinType !== pinType.SITE) {
      firstName = this.capitalizeFirstLetter(pin.firstName);
    }

    return firstName;
  }

  public getLastInitialOrUndefinedIfSite(pin: Pin) {

    let lastInitial: string = undefined;

    if (pin.pinType !== pinType.SITE) {
      lastInitial = this.capitalizeFirstLetter((pin.lastName.substring(0, 1)) + '.');
    }

    return lastInitial;
  }

  public getSiteNamelOrUndefinedIfNotSite(pin: Pin) {

    let siteName: string = undefined;

    if (pin.pinType === pinType.SITE) {
      siteName = 'Crossroads ' + this.capitalizeFirstLetter(pin.siteName);
    }

    return siteName;
  }

  public isHost(pin: Pin): boolean {
    return pin.pinType === pinType.GATHERING;
  }

  public isHostingAny(myPins: Array<Pin>): boolean {
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
    let isPinASite: boolean = pin.pinType === pinType.SITE;
    let doesUserOwnPin: boolean = this.pinHlpr.doesLoggedInUserOwnPin(pin);
    let isMe: boolean = !isPinASite && doesUserOwnPin;

    return isMe;
  }

}
