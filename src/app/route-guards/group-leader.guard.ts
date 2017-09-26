import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ParticipantService } from '../services/participant.service';
import { GroupRole } from '../shared/constants';

@Injectable()
export class GroupLeaderGuard implements CanActivate {
  constructor(private participantService: ParticipantService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    const groupId = route.params['groupId'];
    return this.participantService.getCurrentUserGroupRole(groupId).map(
      userGroupRole => {
        if (userGroupRole !== GroupRole.LEADER) {
          this.router.navigate([`/${route.url[0]}/${groupId}`]);
        }

        return userGroupRole === GroupRole.LEADER;
      }
    );
  }
}
