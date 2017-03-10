import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';

import { SessionService } from '../../../../services/session.service';
import { Participant } from '../../../../models/participant';


@Component({
  selector: 'participant-card',
  templateUrl: 'participant-card.html',
  styleUrls: ['participant-card.component.css']
})
export class ParticipantCardComponent {

  @Input() participant: Participant;
  @Input() pinParticipantId: number;

  constructor(private session: SessionService) {
  }

  public showMeLabel(): boolean {
      let contactId = this.session.getContactId()
        return contactId === this.participant.contactId;
  }

  public showHostLabel(): boolean {
      return this.pinParticipantId === this.participant.participantId;
  }
}
