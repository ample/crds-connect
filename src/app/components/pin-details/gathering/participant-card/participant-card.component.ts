import { ActivatedRoute, Router } from '@angular/router';
import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';

import { SessionService } from '../../../../services/session.service';
import { AppSettingsService } from '../../../../services/app-settings.service';
import { Participant } from '../../../../models/participant';
import { GroupRole } from '../../../../shared/constants';

@Component({
  selector: 'participant-card',
  templateUrl: 'participant-card.html'
})
export class ParticipantCardComponent implements OnInit {

  @Input() participant: Participant;
  @Input() pinParticipantId: number;
  public isLeader: boolean = false;
  public isMe: boolean = false;
  public isApprentice: boolean = false;

  constructor(private session: SessionService,
              private router: Router,
              private route: ActivatedRoute,
              private appSettings: AppSettingsService) {
  }

  public ngOnInit() {
    if (this.participant.canBeHyperlinked === undefined) {
      this.participant.canBeHyperlinked = true;
    }
    if (this.session.getContactId() === this.participant.contactId) {
      this.isMe = true;
      this.participant.canBeHyperlinked = false;
    }
    this.isApprentice = (this.participant.groupRoleId === GroupRole.APPRENTICE);
    this.isLeader     = (this.participant.groupRoleId === GroupRole.LEADER);
  }

  public enableHyperlink(): boolean {
    return this.participant.canBeHyperlinked;
  }

  public showLeaderLabel(): boolean {
    return (this.appSettings.isSmallGroupApp() && this.isLeader);
  }

  public showApprenticeLabel(): boolean {
    return (this.appSettings.isSmallGroupApp() && this.isApprentice);
  }

  public onParticipantClick(): void {
      if (this.participant.canBeHyperlinked) {
        this.router.navigate(['./participant-detail/' + this.participant.groupParticipantId], { relativeTo: this.route });
    }
  }

  public onRemoveParticipant(): void {
    let isRemovingSelf = 'true';
    if (this.isMe && !this.isLeader) {
      this.router.navigate([`./participant-detail/${this.participant.groupParticipantId}/remove-self/${isRemovingSelf}/`],
         { relativeTo: this.route });
    }
  }

}
