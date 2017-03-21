import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';

import { BlandPageService } from '../../../../services/bland-page.service';
import { GroupService } from '../../../../services/group.service';
import { StateService } from '../../../../services/state.service';

import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../../../models/bland-page-details';
import { Inquiry } from '../../../../models/inquiry';
import { Pin } from '../../../../models/pin';
import { Participant } from '../../../../models/participant';


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
    private state: StateService,
    private blandPageService: BlandPageService
  ) {
  }

  public ngOnInit() {
    this.state.setLoading(true);
    this.groupService.getGroupRequests(this.pin.gathering.groupId)
      .subscribe(inquiryList => {
        this.inquiries = inquiryList.filter((inquiry) => {
          return inquiry.placed == null;
        })
        this.state.setLoading(false);
      },
      (error) => {
        this.state.setLoading(false);
        console.log(error);
        this.blandPageService.goToDefaultError("pin-details/" + this.pin.participantId);
      });
  }

  public convertToParticipant(inquiry: Inquiry): Participant {
    return new Participant(null, inquiry.contactId, null,
      inquiry.emailAddress, null, null, null, null,
      inquiry.lastName, inquiry.firstName, null, null);
  }

  public acceptOrDenyInquiry(inquiry: Inquiry, approve: boolean) {
    this.state.setLoading(true);
    this.groupService.acceptOrDenyRequest(this.pin.gathering.groupId, this.pin.gathering.groupTypeId, approve, inquiry).subscribe(
      success => {
        // TODO add profile pictures to template text (otherwise would've used a content block)
        let templateText;
        let bpd;
        if (approve) {
          templateText = '<div class="container"><div class="row text-center"><h3>Request accepted</h3></div>';
        } else {
          templateText = '<div class="container"><div class="row text-center"><h3>Request Denied</h3></div>';
        }
        // tslint:disable-next-line:max-line-length
        templateText += `<br/><div class="row text-center"<span>${inquiry.firstName} ${inquiry.lastName.slice(0, 1)}. has been notified</span></div></div>`;
        bpd = new BlandPageDetails(
          'Return to my pin',
          templateText,
          BlandPageType.Text,
          BlandPageCause.Success,
          'pin-details/' + this.pin.participantId
        );
        this.state.setLoading(false);
        this.blandPageService.primeAndGo(bpd);
      }, (error) => {
        this.state.setLoading(false);
        this.blandPageService.goToDefaultError("pin-details/" + this.pin.participantId);
      });
  }

  public getInquiries() {
    return this.inquiries;
  }
}
