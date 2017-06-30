import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GroupLeaderApplicationStatus, LeaderStatus, ApplicationUrl } from '../shared/constants';
import { GroupService } from '../services/group.service';

@Injectable()
export class GroupLeaderApprovedGuard implements CanActivate {

    constructor(private groupService: GroupService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.groupService.getLeaderStatus().map(
          status => {
            if (status.status === GroupLeaderApplicationStatus.APPROVED) {
              return true;
            } else {
              window.location.href = ApplicationUrl;
              return false;
           }
      });
    }

}
