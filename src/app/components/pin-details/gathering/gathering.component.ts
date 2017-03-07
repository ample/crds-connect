import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';

import { APIService } from '../../../services/api.service';
import { ContentService } from '../../../services/content.service';
import { Pin } from '../../../models/pin';
import { SessionService } from '../../../services/session.service';


@Component({
  selector: 'gathering',
  templateUrl: 'gathering.html'
})
export class GatheringComponent implements OnInit {

  @Input() pin: Pin;
  @Input() isPinOwner: boolean = false;
  @Input() isLoggedIn: boolean = false;

  public isInGathering: boolean = false;
  public sayHiButtonText: string = "Contact host";

  constructor(private api: APIService,
    private content: ContentService,
    private session: SessionService
  ) {
  }

  public ngOnInit() {
    if (this.loggedInUserIsInGathering(this.session.getContactId()) && this.isLoggedIn) {
      this.isInGathering = true;
    }
  }

  public loggedInUserIsInGathering(contactId: number) {
    return this.pin.gathering.Participants.find((participant) => {
      return (participant.contactId === contactId);
    });
  }

}
