import { Group } from '../models/group';
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

import { LeaderStatus, GroupPaths, groupPaths } from '../shared/constants';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class GroupService extends SmartCacheableService<Inquiry[], number> {
  private baseUrl = process.env.CRDS_GATEWAY_CLIENT_ENDPOINT;

  public restVerbs = {
    post: 'POST',
    put: 'PUT'
  };

  public defaults = {
    authorized: null
  };

  constructor(
    private http: Http,
    private session: SessionService,
    private participantService: ParticipantService,
    private router: Router) {
    super();
  }

  public getGroupRequests(groupId: number): Observable<Inquiry[]> {
    let contactId = this.session.getContactId();
    if (super.cacheIsReadyAndValid(groupId, CacheLevel.Full, contactId)) {
      return Observable.of(super.getCache());
    } else {
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

  public handleInvite(guid: string, accepted: boolean, groupId: number): Observable<boolean> {
    return this.session.post(`${this.baseUrl}api/v1.0.0/finder/group/${groupId}/invitation/${guid}`, accepted);
  }

  public getLeaderStatus(): Observable<LeaderStatus> {
    let url = `${this.baseUrl}api/v1.0.0/group-leader/leader-status`;
    return this.session.get (url)
      .do((res) => console.log(res))
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public createGroup(group: Group): Observable<Group> {
    return this.session.post(`${this.baseUrl}api/v1.0.0/group`, group);
  }

  public createParticipants(group: Group) {
    return this.session.post(`${this.baseUrl}api/v1.0.0/group/${group.groupId}/participants`, group.Participants);
  }

  public editGroup(group: Group): Observable<Group> {
    return this.session.post(`${this.baseUrl}api/v1.0.0/group/edit`, group);
  }

  public navigateInGroupFlow(pageToGoTo: number, editOrCreateMode: string, groupId: number): void {
    if (editOrCreateMode === groupPaths.ADD){
      this.router.navigate([`/create-group/page-${pageToGoTo}`]);
    } else if (editOrCreateMode === groupPaths.EDIT) {
      this.router.navigate([`/edit-group/${groupId}/page-${pageToGoTo}`]);
    }
  }

}
