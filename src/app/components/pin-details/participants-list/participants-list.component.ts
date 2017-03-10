import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';

import { Pin } from '../../../models/pin';
import { User } from '../../../models/user';
import { Participant } from '../../../models/participant';


@Component({
  selector: 'participants-list',
  templateUrl: 'participants-list.html'
})
export class ParticipantsListComponent {

  @Input() participants: Participant[];
  @Input() user: User;
  @Input() pinParticipantId: number;

  constructor() {
  }

}
