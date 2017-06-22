import { Injectable} from '@angular/core';
import { UserState } from '../shared/constants';
import { Pin } from '../models/pin';

@Injectable()
export class ListHelperService {

  constructor() {}

  public getUserMapState(userContactId: number, pins: Array<Pin>): UserState {

    let userState: UserState = undefined;

    let isUserLoggedIn: boolean = userContactId != null && userContactId != undefined && !isNaN(userContactId);

    let userPinByContactId: Pin;

    if (pins != undefined || pins != null) {
      userPinByContactId =  pins.find(pin => pin.contactId === userContactId);
    }

    let isUserOnMap: boolean = userPinByContactId != undefined;

    if ( !isUserLoggedIn ) {
      userState = UserState.NotLoggedIn;
    } else if ( !isUserOnMap ) {
      userState = UserState.LoggedIn_NotOnMap;
    } else {
      userState = UserState.LoggedIn_OnMap;
    }

    return userState;
  }

    public truncateTextEllipsis(fullString: string, maxLength: number): string {
      if (fullString.length > maxLength) {
        fullString = fullString.substr(0, maxLength).trim() + '...';
      }
      return fullString;
    }

    public roundedProximity(proximity: number): any {
      return proximity ? proximity.toFixed(1) : '';
    }
}
