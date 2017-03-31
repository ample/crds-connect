import { Injectable, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { SmartCacheableService, CacheLevel } from './base-service/cacheable.service';

import { IFrameParentService } from './iframe-parent.service';
import { SessionService } from './session.service';
import { ParticipantService } from './participant.service';

import { Pin } from '../models/pin';
import { Inquiry } from '../models/inquiry';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class GroupService extends SmartCacheableService<Inquiry[], number> {

  private baseUrl = process.env.CRDS_API_ENDPOINT;
  private baseServicesUrl = process.env.CRDS_API_SERVICES_ENDPOINT;

  public restVerbs = {
    post: 'POST',
    put: 'PUT'
  };

  public defaults = {
    authorized: null
  };

  constructor(private http: Http, private session: SessionService, private participantService: ParticipantService) {
    super();
  }

  public getGroupRequests(groupId: number): Observable<Inquiry[]> {
    let contactId = this.session.getContactId();
    if (super.cacheIsReadyAndValid(groupId, CacheLevel.Full, contactId)) {
      console.log('GroupService got cached Inquiries');
      return Observable.of(super.getCache());
    } else {
      console.log('GroupService got new Inquiries');
      return this.session.get(`${this.baseUrl}api/v1.0.0/group-tool/inquiries/${groupId}`)
        .do((results) => super.setSmartCache(results, CacheLevel.Full, groupId, contactId));
    }
  }

  public acceptOrDenyRequest(groupId: number, groupTypeId: number, approve: boolean, inquiry: Inquiry) {
    console.log('GroupService cleared Inquiries');
    // tslint:disable-next-line:max-line-length
    return this.session.post(`${this.baseUrl}api/v1.0.0/group-tool/group-type/${groupTypeId}/group/${groupId}/inquiry/approve/${approve}`, inquiry)
      .do((results) => {
        super.clearCache();
        this.participantService.clearGroupFromCache(groupId);
      });
  }
}
