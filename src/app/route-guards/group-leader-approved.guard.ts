import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GroupLeaderApplicationStatus, LeaderStatus, ApplicationUrl } from '../shared/constants';
import { ParticipantService } from '../services/participant.service';

@Injectable()
export class GroupLeaderApprovedGuard implements CanActivate {
  constructor(private router: Router, private participantService: ParticipantService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.participantService.getLeaderStatus().map(status => {
      if (status.status === GroupLeaderApplicationStatus.APPROVED) {
        return true;
      } else {
        this.navigateAway();
        return false;
      }
    });
  }

  // This was literally pulled out into a method so it could be tested. Why you do angular 2?
  private navigateAway() {
    window.location.href = ApplicationUrl;
  }
}
