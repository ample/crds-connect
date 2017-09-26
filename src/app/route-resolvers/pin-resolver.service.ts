import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { PinService } from '../services/pin.service';
import { Pin, PinIdentifier, pinType } from '../models';
import { BlandPageService } from '../services/bland-page.service';
import { BlandPageDetails, BlandPageType, BlandPageCause } from '../models/bland-page-details';
import { environment } from '../../environments/environment';

@Injectable()
export class PinResolver implements Resolve<Pin> {
  constructor(
    private pinService: PinService,
    private blandPageService: BlandPageService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Pin> {
    const participantId: number = route.params['participantId'];
    const groupId: number = route.params['groupId'];
    const routeType: string = route.url[0].path; // person, gathering, or small-group
    let pinIdentifier: PinIdentifier;

    if (participantId != null && routeType.includes('person')) {
      pinIdentifier = new PinIdentifier(pinType.PERSON, participantId);
    } else {
      if (routeType === 'gathering') {
        pinIdentifier = new PinIdentifier(pinType.GATHERING, groupId);
      } else if (routeType === 'small-group') {
        pinIdentifier = new PinIdentifier(pinType.SMALL_GROUP, groupId);
      }
    }

    return this.pinService.getPinDetails(pinIdentifier)
      .catch((err: Response, caught: Observable<Pin>) => {
        if (err !== undefined) {
          const pinResolverError = new BlandPageDetails(
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
