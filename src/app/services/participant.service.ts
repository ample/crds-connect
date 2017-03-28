import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { CacheableService, CacheLevel } from './base-service/cacheable.service';

import { SessionService } from './session.service';

import { Participant } from '../models/participant';
import { Group } from '../models/group';

@Injectable()
export class ParticipantService extends CacheableService<Group[]> {


    private baseUrl = process.env.CRDS_API_ENDPOINT;
    private baseServicesUrl = process.env.CRDS_API_SERVICES_ENDPOINT;

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
                super.setCache(filtered, CacheLevel.Partial, contactId)
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

                console.log("ParticipantService got cached Participants");
                return Observable.of(group.Participants);
            }
        }

        return this.getParticipantsByGroupFromBackend(groupId);
    }

    private getParticipantsByGroupFromBackend(groupId: number): Observable<Participant[]> {
        let contactId = this.session.getContactId();
        return this.session.get(`${this.baseUrl}api/v1.0.0/finder/participants/${groupId}`)
            .do((res: Participant[]) => {
                let cache: Array<Group> = new Array<Group>();
                if (super.isAtLeastPartialCache() && super.isCachedForUser(contactId)) {
                    console.log("ParticipantService got new Participants and added them to the cache");
                    cache = super.getCache();
                } else {
                    console.log("ParticipantService got new Participants and created a new cache");
                }
                cache.push(Group.overload_Constructor_One(groupId, res));
                super.setCache(cache, CacheLevel.Partial, contactId);
            })
            .catch((error: any) => Observable.throw(error || 'Server exception'));
    }
}