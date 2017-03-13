import { Injectable, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { SessionService } from './session.service';
import { sayHiTemplateId } from '../shared/constants';
import { User } from '../models/user';
import { StateService } from '../services/state.service';



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



  constructor(private http: Http,
    private session: SessionService,
    private router: Router,
    private state: StateService
    ) {
    this.SayHiTemplateId = sayHiTemplateId;
  }

  public ngOnInit(): void {
    this.state.setLoading(false);
  }


  public sendHiEmail(user: User, pin: Pin): Observable<any> {
    // Create merge data for this template
    debugger;
    let emailInfo = {
      "fromEmailAddress": user.email,
      "toEmailAddress": pin.emailAddress,
      "subject": "Hi",
      "body": "Just wanted to say hi",
      'mergeData': this.createTemplateDictionary(user, pin),
      "templateId": this.SayHiTemplateId 
    };
    
    this.state.setLoading(true);

    return this.session.post(this.baseServicesUrl + 'api/v1.0.0/email/send', emailInfo)
      .map((res: any) => {
        this.router.navigate(['/member-said-hi']);
        this.state.setLoading(false);
        return res;
      })
      .catch((err) => Observable.throw(err.json().error));
  }

  public createTemplateDictionary(user:User, pin:Pin) {
    return {
      'Community_Member_Name': user.firstname + ' ' + user.lastname.charAt(0) + '.',
      'Pin_First_Name': pin.firstName,
      'Community_Member_Email': user.email
    };
  }

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
