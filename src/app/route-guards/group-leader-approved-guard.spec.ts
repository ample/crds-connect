/*
 * Testing a route guard
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#isolated-unit-tests
 *            https://angular.io/docs/ts/latest/guide/router.html#!#guards
 */

import { Observable } from 'rxjs/Rx';
import { TestBed, async, inject } from '@angular/core/testing';
import { GroupLeaderApprovedGuard } from './group-leader-approved.guard';
import { ParticipantService } from '../services/participant.service';
import { GroupLeaderApplicationStatus, LeaderStatus, ApplicationUrl } from '../shared/constants';

describe('GroupLeaderApprovedGuard', () => {
  let guard;

  let fakeRouter = jasmine.createSpyObj('router', ['navigate']);
  let fakeRouterState: any = {}; // RouterStateSnapshot
  let fakeActivatedRoute: any; // ActivatedRouteSnapshot
  let fakeParticipantService: any = jasmine.createSpyObj<ParticipantService>('participantService', ['getLeaderStatus']);

  beforeEach(() => {
    guard = new GroupLeaderApprovedGuard(fakeRouter, fakeParticipantService);
  });

  it('should return true if user is a approved leader', () => {
    fakeParticipantService.getLeaderStatus.and.returnValue(Observable.of(GroupLeaderApplicationStatus.APPROVED));
    let result = guard.canActivate(
      {
        path: '/create-group'
      },
      fakeRouterState
    );

    expect(result).toBeTruthy();
    expect(fakeParticipantService.getLeaderStatus).toHaveBeenCalled();
  });

  it('should navigate away if user is not a approved leader', done => {
    fakeParticipantService.getLeaderStatus.and.returnValue(Observable.of(GroupLeaderApplicationStatus.DENIED));
    let obs$ = guard.canActivate(
      {
        // this is an external link, not just route -- window.location.href
        path: ApplicationUrl
      },
      fakeRouterState
    );

    spyOn(guard, 'navigateAway');

    obs$.subscribe(result => {
      expect(result).toBeFalsy();
      expect(guard['navigateAway']).toHaveBeenCalled();
      done();
    });
  });
});
