import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { PinService } from '../services/pin.service';
import { Pin, pinType } from '../models/pin';
import { PinIdentifier } from '../models/pin-identifier';
import { BlandPageService } from '../services/bland-page.service';
import { BlandPageDetails, BlandPageType, BlandPageCause } from '../models/bland-page-details';

@Injectable()
export class PinResolver implements Resolve<Pin> {

  constructor(
    private pinService: PinService,
    private blandPageService: BlandPageService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Pin> {
    let participantId: number, groupId: number, pinIdentifier: PinIdentifier;

    participantId = route.params['participantId'];
    groupId = route.params['groupId'];

    if (participantId != null) {
      pinIdentifier = new PinIdentifier(pinType.PERSON, participantId)
    } else {
      pinIdentifier = new PinIdentifier(pinType.GATHERING, groupId)
    }

    return this.pinService.getPinDetails(pinIdentifier)
      .catch((err: Response, caught: Observable<Pin>) => {
        if (err !== undefined) {
          let pinResolverError = new BlandPageDetails(
            'Back To The Map',
            'Unable to get details of a pin on the map',
            BlandPageType.Text,
            BlandPageCause.Error,
            '',
            ''
          );
          this.blandPageService.primeAndGo(pinResolverError);
          return Observable.throw('Unable to get details of a pin on the map');
        }
        return Observable.throw(caught);
      });
  }
}