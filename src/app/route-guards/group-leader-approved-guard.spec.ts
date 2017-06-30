import { Observable } from 'rxjs/Rx';

/*
 * Testing a route guard
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#isolated-unit-tests
 *            https://angular.io/docs/ts/latest/guide/router.html#!#guards
 */

import { GroupLeaderApprovedGuard } from './group-leader-approved.guard';
import { GroupService } from '../services/group.service';
import { GroupLeaderApplicationStatus, LeaderStatus, ApplicationUrl } from '../shared/constants';

describe('GroupLeaderApprovedGuard', () => {
    let guard;

    let fakeRouter: any = jasmine.createSpyObj('router', ['navigate']);
    let fakeRouterState: any = { }; // RouterStateSnapshot
    let fakeActivatedRoute: any; // ActivatedRouteSnapshot
    let mockGroupService: any = jasmine.createSpyObj<GroupService>('groupService', ['getLeaderStatus']);

    beforeEach(() => {
        guard = new GroupLeaderApprovedGuard(mockGroupService, fakeRouter);
    });

    it('should return true if user is a approved leader', () => {
        (mockGroupService.getLeaderStatus).and.returnValue(Observable.of(GroupLeaderApplicationStatus.APPROVED));
        let result = guard.canActivate({
            path: '/create-group'
        }, fakeRouterState);

        expect(result).toBeTruthy();
        expect(mockGroupService.getLeaderStatus).toHaveBeenCalled();
    });

    it('should navigate away if user is not a approved leader', done => {
        (mockGroupService.getLeaderStatus).and.returnValue(Observable.of(GroupLeaderApplicationStatus.DENIED));
        let obs$ = guard.canActivate({
                // this is an external link, not just route -- window.location.href
            path: ApplicationUrl,
        }, fakeRouterState);

        obs$.subscribe(result => {
            expect(result).toBeFalsy();
            done();
        });
    });
});
