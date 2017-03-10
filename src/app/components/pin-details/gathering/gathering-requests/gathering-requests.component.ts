import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';

import { GroupService } from '../../../../services/group.service';
import { StateService } from '../../../../services/state.service';
import { Pin } from '../../../../models/pin';
import { Participant } from '../../../../models/participant';
import { Inquiry } from '../../../../models/inquiry';



@Component({
  selector: 'gathering-requests',
  templateUrl: 'gathering-requests.html',
  styleUrls: ['gathering-requests.component.css']
})
export class GatheringRequestsComponent implements OnInit {

  @Input() pin: Pin;
  private inquiries: Inquiry[] = [];

  constructor(
    private groupService: GroupService,
    private state: StateService
  ) {
  }

  public ngOnInit() {
      this.state.setLoading(true);
    this.groupService.getGroupRequests(this.pin.gathering.groupId)
        .subscribe(inquiryList => {this.inquiries = inquiryList;
                                   this.state.setLoading(false);
                                },
                   err => console.log(err));
  }

  public convertToParticipant(inquiry: Inquiry): Participant {
    return new Participant(null, inquiry.contactId, null,
                          inquiry.emailAddress, null, null, null, null,
                          inquiry.lastName, inquiry.firstName, null, null);
  }
}
