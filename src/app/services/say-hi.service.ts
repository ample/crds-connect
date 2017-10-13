import { Injectable } from '@angular/core';
import { BlandPageDetails, BlandPageCause, BlandPageType } from '../models/bland-page-details';
import { BlandPageService } from '../services/bland-page.service';
import { SessionService } from './session.service';
import { Observable } from 'rxjs/Observable';
import { StateService } from '../services/state.service';
import { sayHiTemplateId } from '../shared/constants';
import { Pin } from '../models/pin';

import { environment } from '../../environments/environment';

@Injectable()
export class SayHiService {
  private baseUrl = environment.CRDS_GATEWAY_CLIENT_ENDPOINT;
  private baseServicesUrl = environment.CRDS_SERVICES_CLIENT_ENDPOINT;
  public SayHiTemplateId: number;

  constructor(
    private state: StateService,
    private session: SessionService,
    private blandPageService: BlandPageService
  ) {
    this.SayHiTemplateId = sayHiTemplateId;
  }
  public sendHiEmail(user: Pin, pin: Pin, message: string): Observable<any> {
    // Create merge data for this template
    let emailInfo = {
      fromEmailAddress: user.emailAddress,
      toEmailAddress: pin.emailAddress,
      subject: 'Hi',
      body: 'Just wanted to say hi',
      mergeData: this.createSayHiTemplateDictionary(user, pin, message),
      templateId: this.SayHiTemplateId
    };

    this.state.setLoading(true);
    this.logSayHi(user.contactId, pin.contactId).subscribe();
    return this.session
      .post(this.baseServicesUrl + 'communication/api/v1.0.0/email/send', emailInfo)
      .map((res: any) => {
        let memberSaidHi = new BlandPageDetails(
          'Return to map',
          '<h1 class="title">Success!</h1>',
          BlandPageType.Text,
          BlandPageCause.Success,
          ''
        );
        this.blandPageService.primeAndGo(memberSaidHi);
        return res;
      })
      .catch(err => Observable.throw(err.json().error));
  }

  public createSayHiTemplateDictionary(user: Pin, pin: Pin, userMessage: string) {
    return {
      Community_Member_Name: user.firstName + ' ' + user.lastName.charAt(0) + '.',
      Pin_First_Name: pin.firstName,
      Community_Member_Email: user.emailAddress,
      Community_Member_City: user.address.city,
      Community_Member_State: user.address.state,
      User_Message : userMessage
    };
  }

  public logSayHi(fromId: number, toId: number): Observable<boolean> {
    return this.session.post(`${this.baseUrl}api/v1.0.0/finder/sayhi/${fromId}/${toId}`, null);
  }
}
