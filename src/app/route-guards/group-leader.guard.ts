import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ParticipantService } from '../services/participant.service';

@Injectable()
export class GroupLeaderGuard implements CanActivate {
    constructor(private participantService: ParticipantService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean> | Promise<boolean> | boolean {
        let groupId = route.params['groupId'];
        return this.participantService.getIsCurrentUserALeader(groupId).map(isGroupLeader => {
        let redirectUrl = `/${route.url[0]}/${groupId}`;
        if (!isGroupLeader) {
            this.router.navigate([redirectUrl]);
        }

        return isGroupLeader;
        });
    }
}
