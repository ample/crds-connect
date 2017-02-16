import { Injectable, NgZone } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { SessionService } from './session.service';

import { IFrameParentService } from './iframe-parent.service';
import { Pin } from '../models/pin';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class PinService {

  private baseUrl = process.env.CRDS_API_ENDPOINT;

  public restVerbs = {
    post: 'POST',
    put: 'PUT'
  };

  public defaults = {
    authorized: null
  };

  constructor( private http: Http,
               private session: SessionService) { }


  public getPinDetails(participantId: number): Observable<Pin> {
    return this.http.get(`${this.baseUrl}api/v1.0.0/finder/pin/${participantId}`)
    .map((res: Response) => res.json())
    .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  public getPinDetailsByContactId(contactId: number): Observable<Pin> {
    return this.http.get(`${this.baseUrl}api/v1.0.0/finder/pin/contact/${contactId}`)
    .map((res: Response) => res.json())
    .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}
