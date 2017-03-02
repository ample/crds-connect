import { Injectable, NgZone } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { SessionService } from './session.service';
import { sayHiTemplateId } from '../shared/constants';
import { User } from '../models/user';

import { IFrameParentService } from './iframe-parent.service';
import { Pin } from '../models/pin';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class PinService {

  private baseUrl = process.env.CRDS_API_ENDPOINT;
  private baseServicesUrl = process.env.CRDS_API_SERVICES_ENDPOINT;

  public SayHiTemplateId: number;
  
  public restVerbs = {
    post: 'POST',
    put: 'PUT'
  };

  public defaults = {
    authorized: null
  };



  constructor( private http: Http,
               private session: SessionService) { 
      this.SayHiTemplateId = sayHiTemplateId;
  }

  public sendHiEmail(user: User,pin: Pin): Observable<any> {
    let emailInfo = {
      "fromEmailAddress": user.email,
      "toEmailAddress": pin.emailAddress,
      "subject": "Hi",
      "body": "Just wanted to say hi",
      "templateId": this.SayHiTemplateId
    };
    console.log(emailInfo, pin);

    return this.session.post(this.baseServicesUrl + 'api/v1.0.0/SendEmail', emailInfo);
  }

  // public postUser(user: User): Observable<any> {
  //   return this.session.post(this.baseUrl + 'api/v1.0.0/user', user)
  //     .map(this.extractData)
  //     .catch(this.handleError);
  // };


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
