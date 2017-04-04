//Data used for drawing a label on the map

import { pinType } from './pin';

export class PinLabelData {
  firstName: string;
  lastInitial: string;
  siteName: string;
  isHost: boolean;
  isMe: boolean;
  pinType: pinType;


  constructor( firstName: string, lastInitial: string, siteName: string,
               isHost: boolean, isMe: boolean, pinType: pinType ) {
    this.firstName =  firstName;
    this.lastInitial = lastInitial;
    this.siteName = siteName;
    this.isHost = isHost;
    this.isMe = isMe;
    this.pinType = pinType;
  }

}

