import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { CacheableService, CacheLevel } from './base-service/cacheable.service';
import * as _ from 'lodash';

import { SessionService } from './session.service';

import { Group, Participant } from '../models';
import { GroupMessageDTO } from '../models/group-message-dto';
import { MsgToLeader } from '../models/msg-to-leader';

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
                    return g.groupId !== groupId;
                });
                super.setCache(filtered, CacheLevel.Partial, contactId);
            }
        }
    }

    public getGroupParticipant(groupId: number, groupParticipantId: number): Observable<Participant> {
        let participant: Participant;
        return this.getParticipants(groupId).map(participants => {
            participant = participants.find(gp => {
                return gp.groupParticipantId === groupParticipantId;
            });

            if (participant == null) {
                throw(`Group participant is not part of group id: ${groupId}`);
            } else {
                return participant;
            }
        });
    }

    public getParticipants(groupId: number): Observable<Participant[]> {
        let contactId = this.session.getContactId();
        if (super.isCachedForUser(contactId)) {
            let groupParticipantCache = super.getCache();

            let group = groupParticipantCache.find(g => {
                return g.groupId === groupId;
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

    public removeParticipant(groupId: number, groupParticipantId: number, message: string) {
        let url = `${this.baseUrl}api/v1.0.0/finder/group/participant/remove`;

        let groupInformation = { groupId: groupId, groupParticipantId: groupParticipantId, message: message };

        return this.session.post(url, groupInformation).do((res: any) => {
            this.removeParticipantFromCache(groupId, groupParticipantId);
        });
    }

    public removeSelfAsParticipant(groupId: number, groupParticipantId: number) {
        let url = `${this.baseUrl}api/v1.0.0/group-tool/group/participant/remove-self`;

        let groupInformation = { groupId: groupId, groupParticipantId: groupParticipantId };

        return this.session.post(url, groupInformation).do((res: any) => {
            this.removeParticipantFromCache(groupId, groupParticipantId);
        });
    }

    public updateParticipantRole(groupId: number, participantId: number, roleId: number) {
        let url = `${this.baseUrl}api/v1.0.0/group/updateParticipantRole/${groupId}/${participantId}/${roleId}`;

        return this.session.post(url, null).do((res: any) => {
            console.log('updated participant role');

            // update the cache here
            this.updateParticipantRoleInCache(groupId, participantId, roleId);
        });

    }

    private updateParticipantRoleInCache(groupId: number, participantId: number, roleId: number) {
        let contactId = this.session.getContactId();
        let index = null;
        if (super.isCachedForUser(contactId)) {
            let cache = super.getCache();
            let group = cache.find(g => {
                return g.groupId === groupId;
            });

            if ( group != null ) {
                index = group.Participants.findIndex( x => x.participantId === participantId);
            }

            if ( index !== null ) {
                group.Participants[index].groupRoleId = roleId;
            }

            super.setCache(cache, super.getCacheLevel(), contactId);
        }
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

    public getAllParticipantsOfRoleInGroup(groupId: number, groupRole: number): Observable<Participant[]> {
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

    private removeParticipantFromCache(groupId: number, groupParticipantId: number) {
        let contactId = this.session.getContactId();
        if (super.isCachedForUser(contactId)) {
            let cache = super.getCache();
            let group = cache.find(g => {
                return g.groupId === groupId;
            });

            group.Participants = group.Participants.filter(gp => {
                return gp.groupParticipantId !== groupParticipantId;
            });
            super.setCache(cache, super.getCacheLevel(), contactId);
        }
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

    public submitLeaderMessageToAPI(groupId: number, msgToLeader: MsgToLeader): Observable<any> {
        let url = `${this.baseUrl}api/grouptool/${groupId}/leadermessage`;

        let groupMsgDto: GroupMessageDTO = new GroupMessageDTO(msgToLeader.subject, msgToLeader.message, null);

        return this.session.post(url, groupMsgDto);
    }

    public doesUserLeadAnyGroups(): Observable<Boolean> {

        let contactId: number = this.session.getContactId();

        if(contactId !== null){
          let doesUserLeadSomeGroupUrl = `${this.baseUrl}api/v1.0.0/finder/doesuserleadsomegroup/${contactId}`;

          return this.session.get(doesUserLeadSomeGroupUrl)
            .catch( (err) => Observable.throw('Error getting doesLeaderLeadSomeGroup!') );
        } else {
          return Observable.of(false);
        }
    }

}
