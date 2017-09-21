import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

import { SessionService } from '../../../../services/session.service';
import { AppSettingsService } from '../../../../services/app-settings.service';

import { Group } from '../../../../models/group';
import { Participant } from '../../../../models/participant';

import { GroupRole } from '../../../../shared/constants';

@Component({
  selector: 'participant-card',
  templateUrl: 'participant-card.html'
})
export class ParticipantCardComponent implements OnInit {
  @Input() participant: Participant;
  @Input() pinParticipantId: number;
  @Input() groupCardIsDisplayedOn: Group;
  @Input() userIsLeader: boolean;
  public isLeader: boolean = false;
  public isMe: boolean = false;
  public isApprentice: boolean = false;
  public isTrialMember: boolean = false;

  constructor(private session: SessionService,
              private router: Router,
              private route: ActivatedRoute,
              private appSettings: AppSettingsService) {
  }

  public ngOnInit() {
    if (this.session.getContactId() === this.participant.contactId) {
      this.isMe = true;
    }

    if (!this.userIsLeader || this.isMe) {
      this.participant.canBeHyperlinked = false;
    } else if (this.participant.canBeHyperlinked === undefined) {
      this.participant.canBeHyperlinked = true;
    }

    this.isApprentice  = (this.participant.groupRoleId === GroupRole.APPRENTICE);
    this.isLeader      = (this.participant.groupRoleId === GroupRole.LEADER);
    this.isTrialMember = (this.participant.groupRoleId === GroupRole.TRIAL_MEMBER);
  }

  public showLeaderLabel(): boolean {
    return (this.appSettings.isSmallGroupApp() && this.isLeader) ||
    ((this.pinParticipantId === this.participant.participantId) && this.appSettings.isConnectApp());
  }

  public showApprenticeLabel(): boolean {
    return (this.appSettings.isSmallGroupApp() && this.isApprentice);
  }

  public showTrialMemberLabel(): boolean {
    return (this.appSettings.isSmallGroupApp() && this.isTrialMember);
  }

  public onParticipantClick(): void {
    if (this.participant.canBeHyperlinked) {
      if (this.appSettings.isSmallGroupApp()) {
        this.router.navigate([`/small-group/${this.groupCardIsDisplayedOn.groupId}/participant-detail/${this.participant.groupParticipantId}`]);
      } else {
        this.router.navigate(['./participant-detail/' + this.participant.groupParticipantId], { relativeTo: this.route });
      }
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
