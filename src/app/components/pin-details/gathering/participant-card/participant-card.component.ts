import { ActivatedRoute, Router } from '@angular/router';
import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';

import { SessionService } from '../../../../services/session.service';
import { Participant } from '../../../../models/participant';


@Component({
  selector: 'participant-card',
  templateUrl: 'participant-card.html'
})
export class ParticipantCardComponent {

  @Input() participant: Participant;
  @Input() pinParticipantId: number;

  constructor(private session: SessionService, private router: Router, private route: ActivatedRoute) {
  }

  public showMeLabel(): boolean {
      let contactId = this.session.getContactId();
      return contactId === this.participant.contactId;
  }

  public showHostLabel(): boolean {
      return this.pinParticipantId === this.participant.participantId;
  }

  public OnParticipantClick(): void {
    this.router.navigate(['./participant-detail/' + this.participant.groupParticipantId], { relativeTo: this.route });
  }
}
