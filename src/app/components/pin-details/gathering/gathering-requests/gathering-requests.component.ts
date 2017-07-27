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
  templateUrl: 'gathering-requests.html'
})
export class GatheringRequestsComponent implements OnInit {

  @Input() pin: Pin;
  private inquiries: Inquiry[] = [];
  private errorRetrieving: boolean = false;
  private loading: boolean = true;

  constructor(
    private groupService: GroupService,
    private state: StateService,
    private blandPageService: BlandPageService
  ) {
  }

  public ngOnInit() {
    this.groupService.getGroupRequests(this.pin.gathering.groupId)
      .finally(() => {
        this.loading = false;
      })
      .subscribe(inquiryList => {
        this.inquiries = inquiryList.filter((inquiry) => {
          return inquiry.placed == null;
        });
      },
      (error) => {
        this.errorRetrieving = true;
      });
  }

  public convertToParticipant(inquiry: Inquiry): Participant {
    let canBeHyperlinked: boolean = false;
    return new Participant(null, inquiry.contactId, null,
      inquiry.emailAddress, null, null, null, null,
      inquiry.lastName, inquiry.firstName, null, null, canBeHyperlinked);
  }

  public acceptOrDenyInquiry(inquiry: Inquiry, approve: boolean) {
    this.state.setLoading(true);
    this.groupService.acceptOrDenyRequest(this.pin.gathering.groupId, this.pin.gathering.groupTypeId, approve, inquiry)
    .finally(() => {
      this.state.setLoading(false);
    })
    .subscribe(
      success => {
        // TODO add profile pictures to template text (otherwise would've used a content block)
        let templateText;
        let bpd;
        if (approve) {
          templateText = '<h1 class="title">Request accepted</h1>';
        } else {
          templateText = '<h1 class="title">Request Denied</h1>';
        }
        // tslint:disable-next-line:max-line-length
        templateText += `<p>${inquiry.firstName} ${inquiry.lastName.slice(0, 1)}. has been notified.</p>`;
        bpd = new BlandPageDetails(
          'Return to my pin',
          templateText,
          BlandPageType.Text,
          BlandPageCause.Success,
          'gathering/' + this.pin.gathering.groupId
        );
        this.blandPageService.primeAndGo(bpd);
      }, (error) => {
        inquiry.error = true;
      });
  }

  public getInquiries() {
    return this.inquiries;
  }
}
