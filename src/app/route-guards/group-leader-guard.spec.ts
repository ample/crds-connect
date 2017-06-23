import { Observable } from 'rxjs/Rx';

/*
 * Testing a route guard
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#isolated-unit-tests
 *            https://angular.io/docs/ts/latest/guide/router.html#!#guards
 */

import { ParticipantService } from '../services/participant.service';
import { GroupLeaderGuard } from './group-leader.guard';

describe('GroupLeaderGuard', () => {
    let guard;

    let fakeRouter: any = jasmine.createSpyObj('router', ['navigate']);
    let fakeRouterState: any = { }; // RouterStateSnapshot
    let fakeActivatedRoute: any; // ActivatedRouteSnapshot
    let mockParticipantService: any = jasmine.createSpyObj<ParticipantService>('participantService', ['getIsCurrentUserALeader']);

    beforeEach(() => {
        guard = new GroupLeaderGuard(mockParticipantService, fakeRouter);
    });

    it('should return true if user is a leader', () => {
        (mockParticipantService.getIsCurrentUserALeader).and.returnValue(Observable.of(true));
        let result = guard.canActivate({
            // example route in here
            path: '/small-group/42/participant/3/',
            params: { groupId: 42 }
        }, fakeRouterState);

        expect(result).toBeTruthy();
        expect(mockParticipantService.getIsCurrentUserALeader).toHaveBeenCalledWith(42);
    });

    it('should navigate away if user is not a leader with a small groups urle', done => {
        (mockParticipantService.getIsCurrentUserALeader).and.returnValue(Observable.of(false));
        let obs$ = guard.canActivate({
            // example route in here
            path: '/small-group/42/participant/32/',
            params: { groupId: 42 },
            url: ['small-group', '42', 'participant', '32']
        }, fakeRouterState);

        obs$.subscribe(result => {
            expect(result).toBeFalsy(); // .toBeTruthy()
            expect(fakeRouter.navigate).toHaveBeenCalledWith(['/small-group/42']);
            done();
        });
    });

    it('should navigate away if user is not a leader with a gathering url', done => {
        (mockParticipantService.getIsCurrentUserALeader).and.returnValue(Observable.of(false));
        let obs$ = guard.canActivate({
            // example route in here
            path: '/gathering/42/participant/32/',
            params: { groupId: 42 },
            url: ['gathering', '42', 'participant', '32']
        }, fakeRouterState);

        obs$.subscribe(result => {
            expect(result).toBeFalsy(); // .toBeTruthy()
            expect(fakeRouter.navigate).toHaveBeenCalledWith(['/gathering/42']);
            done();
        });
    });
});
