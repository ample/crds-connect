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

    public getCurrentUserGroupRole(groupId: number): Observable<GroupRole> {
        return this.getUserGroupRole(groupId, this.session.getContactId());
    }

    public getAllLeaders(groupId: number): Observable<Participant[]> {
        try {
            return this.getAllParticipantsOfRoleInGroup(groupId, GroupRole.LEADER);
        } catch (e) {
            console.log(e.message);
            return Observable.of([]);
        }
    }

    private getUserGroupRole(groupId: number, contactId: number = null): Observable<GroupRole> {
        try {
            return this.getUserRoleInGroup(groupId, contactId);
        } catch (e) {
            console.log(e.message);
            return Observable.of(GroupRole.NONE);
        }
    }

    private getUserRoleInGroup(groupId: number, contactId: number): Observable<GroupRole> {
        return this.getParticipants(groupId).map((participants) => {
            if (participants !== undefined) {
                let participant = participants.find(p => {
                    return p.contactId === contactId;
                });
                if (participant !== undefined) {
                    return participant.groupRoleId;
                } else {
                    return GroupRole.NONE;
                }
            } else {
                throw `group with groupId: ${groupId} not found.`;
            }
        }, (e: Error) => {
            throw e.message;
        });
    }

    private getAllParticipantsOfRoleInGroup(groupId: number, groupRole: number): Observable<Participant[]> {
        return this.getParticipants(groupId).map((participants) => {
            let participantsOfRole: Participant[] = [];
            if (participants !== undefined) {
                participants.forEach((participant) => {
                    if (participant.groupRoleId === groupRole) {
                        participantsOfRole.push(participant);
                    }
                });
                return participantsOfRole;
            } else {
                throw `group with groupId: ${groupId} not found.`;
            }
        }, (e: Error) => {
            throw e.message;
        });
    }

    private getParticipantsByGroupFromBackend(groupId: number): Observable<Participant[]> {
        let contactId = this.session.getContactId();
        return this.session.get(`${this.baseUrl}api/v1.0.0/finder/participants/${groupId}`)
            .do((res: Participant[]) => {
                let cache: Array<Group> = new Array<Group>();
                if (super.isCachedForUser(contactId)) {
                    cache = super.getCache();
                }
                cache.push(Group.overload_Constructor_One(groupId, res));
                super.setCache(cache, CacheLevel.Partial, contactId);
            })
            .catch((error: any) => Observable.throw(error || 'Server exception'));
    }
}
