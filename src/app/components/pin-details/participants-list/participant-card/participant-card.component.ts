import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';

import {SessionService} from '../../../../services/session.service';

import { User } from '../../../../models/user';
import { Participant } from '../../../../models/participant';


@Component({
  selector: 'participant-card',
  templateUrl: 'participant-card.html'
})
export class ParticipantCardComponent {

  @Input() participant: Participant;
  @Input() user: User;
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
