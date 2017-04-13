//Data used for drawing a label on the map

import { pinType } from './pin';

export class PinLabelData {
  firstName: string;
  lastInitial: string;
  siteName: string;
  isHost: boolean;
  isMe: boolean;
  pinType: pinType;
  pinLabel: PinLabel;


  constructor( firstName: string, lastInitial: string, siteName: string,
               isHost: boolean, isMe: boolean, pinType: pinType, pinLabel?: PinLabel) {
    this.firstName =  firstName;
    this.lastInitial = lastInitial;
    this.siteName = siteName;
    this.isHost = isHost;
    this.isMe = isMe;
    this.pinType = pinType;
    this.pinLabel = pinLabel;
  }

}

export class PinLabel {
  line1: string;
  line2: string;
  allTextWLineBreak: string;

  constructor (labelData: PinLabelData) {
    this.line1 =  this.getLine1(labelData);
    this.line2 = this.getLine2(labelData);
    this.allTextWLineBreak = this.line1 + '<br>' + this.line2;
  }

  private getLine1 (labelData: PinLabelData) {
    let nameOrTitle: string = labelData.pinType === pinType.SITE ? labelData.siteName.toString() :
                                                                   labelData.firstName + ' ' + labelData.lastInitial;

    return nameOrTitle;
  }

  private getLine2 (labelData: PinLabelData) {
    let hostMeOrBlank: string = '';

    if (labelData.isMe) {
      hostMeOrBlank = 'ME';
    } else if (labelData.isHost) {
      hostMeOrBlank = 'HOST';
    }

    return hostMeOrBlank;
  }

}

