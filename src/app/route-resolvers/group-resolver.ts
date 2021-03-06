import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { SessionService } from '../services/session.service';

import { Group } from '../models/group';
import { environment } from '../../environments/environment';


@Injectable()
export class GroupResolver implements Resolve<any> {

  private baseUrl = environment.CRDS_GATEWAY_CLIENT_ENDPOINT;

  constructor(private session: SessionService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Group> {
    let groupId: number = route.params['groupId'];
    let getGroupByIdUrl: string = `${this.baseUrl}api/v1.0.0/group/${groupId}`;

    return this.session.get(getGroupByIdUrl);
  }
}
