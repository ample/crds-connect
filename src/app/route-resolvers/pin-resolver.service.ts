import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { PinService } from '../services/pin.service';
import { Pin } from '../models/pin';

@Injectable()
export class PinResolver implements Resolve<Pin> {

  constructor(private pinService: PinService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Pin> {
    return this.pinService.getPinDetails(route.params['participantId']);
  }
}