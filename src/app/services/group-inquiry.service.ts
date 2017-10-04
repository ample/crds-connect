import { Group } from '../models/group';
import { Injectable, NgZone } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { SmartCacheableService, CacheLevel } from './base-service/cacheable.service';

import { SessionService } from './session.service';
import { ParticipantService } from './participant.service';

import { Pin } from '../models/pin';
import { Person } from '../models/person';
import { Inquiry } from '../models/inquiry';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class GroupInquiryService extends SmartCacheableService<Inquiry[], number> {
  private baseUrl = environment.CRDS_GATEWAY_CLIENT_ENDPOINT;

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
      return Observable.of(super.getCache());
    } else {
      return this.session
        .get(`${this.baseUrl}api/v1.0.0/group-tool/inquiries/${groupId}`)
        .do(results => super.setSmartCache(results, CacheLevel.Full, groupId, contactId));
    }
  }

  public acceptOrDenyRequest(groupId: number, groupTypeId: number, approve: boolean, inquiry: Inquiry) {
    console.log('GroupService cleared Inquiries');
    // tslint:disable-next-line:max-line-length
    return this.session
      .post(
        `${this.baseUrl}api/v1.0.0/group-tool/group-type/${groupTypeId}/group/${groupId}/inquiry/approve/${approve}`,
        inquiry
      )
      .do(results => {
        super.clearCache();
        this.participantService.clearGroupFromCache(groupId);
      });
  }

  public handleInvite(guid: string, accepted: boolean, groupId: number): Observable<boolean> {
    return this.session.post(`${this.baseUrl}api/v1.0.0/finder/group/${groupId}/invitation/${guid}`, accepted);
  }

  public requestToJoinGathering(gatheringId: number): Observable<boolean> {
    return this.session.post(`${this.baseUrl}api/v1.0.0/finder/pin/gatheringjoinrequest`, gatheringId);
  }

  public inviteToGroup(groupId: number, someone: Person, finderType: string): Observable<boolean> {
    return this.session.post(`${this.baseUrl}api/v1.0.0/finder/pin/invitetogroup/${groupId}/${finderType}`, someone);
  }

  public addToGroup(groupId: number, someone: Person, roleId: number): Observable<boolean> {
    return this.session.post(`${this.baseUrl}api/v1.0.0/finder/pin/addtogroup/${groupId}/${roleId}`, someone);
  }

  public getMatch(searchUser: Person): Observable<boolean> {
    return this.session.post(`${this.baseUrl}api/v1.0.0/finder/getmatch`, searchUser);
  }
}
