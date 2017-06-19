import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { CacheableService, CacheLevel } from './base-service/cacheable.service';
import * as _ from 'lodash';

import { SessionService } from './session.service';

import { Participant } from '../models/participant';
import { Group } from '../models/group';
import { GroupRole } from '../shared/constants';

@Injectable()
export class ParticipantService extends CacheableService<Group[]> {


    private baseUrl = process.env.CRDS_GATEWAY_CLIENT_ENDPOINT;

    constructor(private session: SessionService) {
        super();
    }

    public clearGroupFromCache(groupId: number) {
        if (groupId) {
            let contactId = this.session.getContactId();
            let cache = super.getCache();
            if (cache) {
                let filtered = cache.filter((g) => {
                    return g.groupId != groupId;
                });
                super.setCache(filtered, CacheLevel.Partial, contactId);
            }
        }
    }

    public getParticipants(groupId: number): Observable<Participant[]> {
        let contactId = this.session.getContactId();
        if (super.isCachedForUser(contactId)) {
            let groupParticipantCache = super.getCache();

            let group = groupParticipantCache.find(g => {
                return g.groupId == groupId;
            });

            if (group != null) {

                return Observable.of(group.Participants);
            }
        }

        return this.getParticipantsByGroupFromBackend(groupId);
    }

    public loggedInUserIsLeaderOfGroup(groupId: number): boolean {
        let contactId = this.session.getContactId();
        if (super.isCachedForUser(contactId)) {
            let groupParticipantCache = super.getCache();

            let group = groupParticipantCache.find(g => {
                return g.groupId === groupId;
            });

            let participant = group.Participants.find(p => {
                return p.contactId === contactId;
            })

            return participant.groupRoleId === GroupRole.LEADER;
        }
        return false;
    }

    private getParticipantsByGroupFromBackend(groupId: number): Observable<Participant[]> {
        let contactId = this.session.getContactId();
        return this.session.get(`${this.baseUrl}api/v1.0.0/finder/participants/${groupId}`)
            .do((res: Participant[]) => {
                let cache: Array<Group> = new Array<Group>();
                if (super.isAtLeastPartialCache() && super.isCachedForUser(contactId)) {
                    cache = super.getCache();
                } else {
                }
                cache.push(Group.overload_Constructor_One(groupId, res));
                super.setCache(cache, CacheLevel.Partial, contactId);
            })
            .catch((error: any) => Observable.throw(error || 'Server exception'));
    }
}
