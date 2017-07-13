import { ActivatedRoute, Router } from '@angular/router';
import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';

import { SessionService } from '../../../../services/session.service';
import { Participant } from '../../../../models/participant';


@Component({
  selector: 'participant-card',
  templateUrl: 'participant-card.html'
})
export class ParticipantCardComponent implements OnInit {

  @Input() participant: Participant;
  @Input() pinParticipantId: number;
  @Input() isLeader: boolean = false;
  public canBeHyperlinked: boolean = true;
  private isMe: boolean = false;

  constructor(private session: SessionService, private router: Router, private route: ActivatedRoute) {
  }

  public ngOnInit() {
    if (this.session.getContactId() === this.participant.contactId) {
      this.isMe = true;
      this.canBeHyperlinked = false;
    }
  }

  public showHostLabel(): boolean {
      return this.pinParticipantId === this.participant.participantId;
  }

  public onParticipantClick(): void {
    if (this.canBeHyperlinked) {
      this.router.navigate(['./participant-detail/' + this.participant.groupParticipantId], { relativeTo: this.route });
    }
  }

  public onRemoveParticipant(): void {
    let isRemovingSelf = 'true';
    this.router.navigate([`./participant-detail/${this.participant.groupParticipantId}/remove-self/${isRemovingSelf}/`],
       { relativeTo: this.route });
  }

}
