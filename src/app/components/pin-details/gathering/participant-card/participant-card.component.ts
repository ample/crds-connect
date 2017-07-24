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
  public canBeHyperlinked: boolean = true;
  public isMe: boolean = false;
  public isApprentice: boolean = false;

  constructor(private session: SessionService,
              private router: Router,
              private route: ActivatedRoute,
              private appSettingsService: AppSettingsService) {
  }

  public ngOnInit() {
    if (this.session.getContactId() === this.participant.contactId) {
      this.isMe = true;
      this.canBeHyperlinked = false;
    }
    this.isApprentice = (this.participant.groupRoleId === GroupRole.APPRENTICE);
    this.isLeader     = (this.participant.groupRoleId === GroupRole.LEADER);
  }

  public showLeaderLabel(): boolean {
    return (this.appSettingsService.isSmallGroupApp() && this.isLeader);
  }

  public showApprenticeLabel(): boolean {
    return (this.appSettingsService.isSmallGroupApp() && this.isApprentice);
  }

  public showHostLabel(): boolean {
      return (this.pinParticipantId === this.participant.participantId) && this.appSettingsService.isConnectApp();
  }

  public onParticipantClick(): void {
    if (this.canBeHyperlinked) {
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
