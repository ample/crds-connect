import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { PinService } from '../services/pin.service';
import { Pin, pinType } from '../models/pin';
import { PinIdentifier } from '../models/pin-identifier';

@Injectable()
export class PinResolver implements Resolve<Pin> {

  constructor(private pinService: PinService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Pin> {
    let participantId: number, groupId: number, pinIdentifier: PinIdentifier;

    participantId = route.params['participantId'];
    groupId = route.params['groupId'];

    if (participantId != null) {
      pinIdentifier = new PinIdentifier(pinType.PERSON, participantId)
    } else {
      pinIdentifier = new PinIdentifier(pinType.GATHERING, groupId)
    }

    return this.pinService.getPinDetails(pinIdentifier);
  }
}