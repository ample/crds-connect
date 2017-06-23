/*
 * Testing a Service
 * More info: https://angular.io/docs/ts/latest/guide/testing.html
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { ParticipantService } from './participant.service';
import { SessionService } from './session.service';
import { Group } from '../models/group';
import { Participant } from '../models/participant';
import { MockTestData } from '../shared/MockTestData';
import { CacheLevel } from './base-service/cacheable.service';
import { Observable } from 'rxjs/Rx';
import { GroupRole } from '../shared/constants';

describe('ParticipantService', () => {
    let service, mockSessionService;


    beforeEach(() => {
        mockSessionService = jasmine.createSpyObj<SessionService>('session', ['get', 'getContactId']);

        TestBed.configureTestingModule({
            providers: [
                ParticipantService,
                { provide: SessionService, useValue: mockSessionService },
            ]
        });
    });

    // you can also wrap inject() with async() for asynchronous tasks
    // it('...', async(inject([...], (...) => {}));

    describe('ClearGroupFromCache', () => {
        it('should clearGroupFromCache',
            inject([ParticipantService], (service: ParticipantService) => {
                let cache: Array<Group> = new Array<Group>();
                let userId: 123;
                <jasmine.Spy>(mockSessionService.getContactId).and.returnValue(123);

                for (var i = 1; i < 11; i++) {
                    cache.push(MockTestData.getAGroup(i, Math.floor(Math.random() * 10) + 1));
                }
                service['cache'] = cache;
                service['userIdentifier'] = userId;
                service['cacheLevel'] = CacheLevel.Partial;
                expect(service['cache'].length).toBe(10);
                expect(service['cache'].find(g => g.groupId == cache[5].groupId)).not.toBeUndefined();

                service.clearGroupFromCache(cache[5].groupId);

                expect(service['cache'].length).toBe(9);
                expect(service['cache'].find(g => g.groupId == cache[5].groupId)).toBeUndefined();
                expect(mockSessionService.getContactId).toHaveBeenCalled();
            })
        );

        it('should not clear(any)GroupFromCache because groupId is null',
            inject([ParticipantService], (service: ParticipantService) => {
                let cache: Array<Group> = new Array<Group>();
                let userId: 123;
                <jasmine.Spy>(mockSessionService.getContactId).and.returnValue(123);

                for (var i = 1; i < 11; i++) {
                    cache.push(MockTestData.getAGroup(i, Math.floor(Math.random() * 10) + 1));
                }
                service['cache'] = cache;
                service['userIdentifier'] = userId;
                service['cacheLevel'] = CacheLevel.Partial;
                expect(service['cache'].length).toBe(10);

                service.clearGroupFromCache(null);

                expect(service['cache'].length).toBe(10);
                expect(mockSessionService.getContactId).not.toHaveBeenCalled();
            })
        );

        it('should not clear(any)GroupFromCache because cache is null',
            inject([ParticipantService], (service: ParticipantService) => {
                let cache: null;
                let userId: 123;
                <jasmine.Spy>(mockSessionService.getContactId).and.returnValue(123);

                service['cache'] = cache;
                service['userIdentifier'] = userId;
                service['cacheLevel'] = CacheLevel.Partial;
                expect(service['cache']).toBe(undefined);

                service.clearGroupFromCache(192);

                expect(service['cache']).toBe(undefined);
                expect(mockSessionService.getContactId).toHaveBeenCalled();
            })
        );
    });

    describe('getIsCurrentUserALeader', () => {
        it('should return logged in user is leader',
            inject([ParticipantService], (service: ParticipantService) => {
                let cache: Array<Group> = new Array<Group>();
                let userId: 123;
                let result: boolean;
                let selectedGroupId: number;
                <jasmine.Spy>(mockSessionService.getContactId).and.returnValue(userId);
                for (var i = 1; i < 11; i++) {
                    // get a randomw number of participants (between 0 and 10)
                    let numberOfParticipants =  Math.floor(Math.random() * 10) + 1;
                    // out of those participants select one to be the leader
                    let selectedLeader = Math.floor(Math.random() * numberOfParticipants);
                    let g = MockTestData.getAGroup(i, numberOfParticipants);
                    g.Participants[selectedLeader]['groupRoleId'] = GroupRole.LEADER;
                    g.Participants[selectedLeader]['contactId'] = userId;
                    cache.push(g);
                }
                service['cache'] = cache;
                service['userIdentifier'] = userId;
                service['cacheLevel'] = CacheLevel.Full;
                selectedGroupId = cache[Math.floor(Math.random() * 10)].groupId;
                service.getIsCurrentUserALeader(selectedGroupId).subscribe(
                    isLeader => {
                        result = isLeader;
                    }
                );
                expect(result).toBe(true);
            })
        );
        it('should return logged in user is not leader',
            inject([ParticipantService], (service: ParticipantService) => {
                let cache: Array<Group> = new Array<Group>();
                let userId: 123;
                let result: boolean;
                let selectedGroupId: number;
                <jasmine.Spy>(mockSessionService.getContactId).and.returnValue(userId);
                for (var i = 1; i < 11; i++) {
                    // get a random number of participants (between 0 and 10)
                    let numberOfParticipants =  Math.floor(Math.random() * 10) + 1;
                    // out of those participants select one to be the user
                    let selectedLeader = Math.floor(Math.random() * numberOfParticipants);
                    let g = MockTestData.getAGroup(i, numberOfParticipants);
                    g.Participants[selectedLeader]['contactId'] = userId;
                    cache.push(g);
                }
                service['cache'] = cache;
                service['userIdentifier'] = userId;
                service['cacheLevel'] = CacheLevel.Full;
                selectedGroupId = cache[Math.floor(Math.random() * 10)].groupId;
                service.getIsCurrentUserALeader(selectedGroupId).subscribe(
                    isLeader => {
                        result = isLeader;
                    }
                );

                expect(result).toBe(false);
            })
        );
    });

    describe('getParticipants', () => {
        it('should getParticipants',
            inject([ParticipantService], (service: ParticipantService) => {
                let cache: Array<Group> = new Array<Group>();
                let userId: 123;
                let result;
                <jasmine.Spy>(mockSessionService.getContactId).and.returnValue(userId);

                for (var i = 1; i < 11; i++) {
                    cache.push(MockTestData.getAGroup(i, Math.floor(Math.random() * 10) + 1));
                }
                service['cache'] = cache;
                service['userIdentifier'] = userId;
                service['cacheLevel'] = CacheLevel.Partial;
                expect(service['cache'].find(g => g.groupId == cache[5].groupId)).not.toBeUndefined();

                service.getParticipants(cache[5].groupId).subscribe(res => {
                    result = res;
                });

                expect(result.length).toBe(cache[5].Participants.length);
                expect(mockSessionService.getContactId).toHaveBeenCalled();
                expect(mockSessionService.get).not.toHaveBeenCalled();
            })
        );

        it('should getParticipants from backend - notCachedForUser',
            inject([ParticipantService], (service: ParticipantService) => {
                let cache: Array<Group> = new Array<Group>();
                let userId: 123;
                let result;
                <jasmine.Spy>(mockSessionService.getContactId).and.returnValue(999);
                <jasmine.Spy>(mockSessionService.get).and.returnValue(Observable.of(MockTestData.getAParticipantsArray(3)));

                for (var i = 1; i < 11; i++) {
                    cache.push(MockTestData.getAGroup(i, Math.floor(Math.random() * 10) + 1));
                }
                service['cache'] = cache;
                service['userIdentifier'] = userId;
                service['cacheLevel'] = CacheLevel.Partial;

                service.getParticipants(cache[5].groupId).subscribe(res => {
                    result = res;
                });

                expect(result.length).toBe(3);
                expect(mockSessionService.getContactId).toHaveBeenCalled();
                expect(mockSessionService.get).toHaveBeenCalled();
            })
        );

        it('should getParticipants from backend and add it to the cache - groupNotFound',
            inject([ParticipantService], (service: ParticipantService) => {
                let cache: Array<Group> = new Array<Group>();
                let userId: 123;
                let result;
                <jasmine.Spy>(mockSessionService.getContactId).and.returnValue(userId);
                <jasmine.Spy>(mockSessionService.get).and.returnValue(Observable.of(MockTestData.getAParticipantsArray(3)));

                for (let i = 1; i < 11; i++) {
                    cache.push(MockTestData.getAGroup(i, Math.floor(Math.random() * 10) + 1));
                }
                service['cache'] = cache;
                service['userIdentifier'] = userId;
                service['cacheLevel'] = CacheLevel.Partial;
                expect(service['cache'].length).toBe(10);

                service.getParticipants(333).subscribe(res => {
                    result = res;
                });

                expect(result.length).toBe(3);
                expect(service['cache'].length).toBe(11);
                expect(mockSessionService.getContactId).toHaveBeenCalled();
                expect(mockSessionService.get).toHaveBeenCalled();
            })
        );
    });
});
