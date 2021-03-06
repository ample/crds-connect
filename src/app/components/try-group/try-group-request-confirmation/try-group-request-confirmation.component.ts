import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';

import { ContentService } from 'crds-ng2-content-block';

import { SessionService } from '../../../services/session.service';
import { StateService } from '../../../services/state.service';

import { HttpStatusCodes } from '../../../shared/constants';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-try-group-request-confirmation',
  templateUrl: 'try-group-request-confirmation.component.html',
  styles: ['.fauxdal-wrapper { overflow-y: hidden; }']
})
export class TryGroupRequestConfirmationComponent implements OnInit {
  private baseUrl = environment.CRDS_GATEWAY_CLIENT_ENDPOINT;
  private groupId: string;

  constructor(private sessionService: SessionService,
    private router: Router,
    private route: ActivatedRoute,
    private state: StateService,
    private toast: ToastsManager,
    private content: ContentService
  ) {}

  ngOnInit() {
    this.state.setLoading(false);
    this.groupId = this.route.snapshot.params['groupId'];
    document.querySelector('body').style.overflowY = 'hidden';
  }

  public onClose(): void {
    window.history.back();
  }

  public onCancel(): void {
    window.history.back();
  }

  public onSubmit(): void {
    this.state.setLoading(true);
    this.sessionService.post(`${this.baseUrl}api/v1.0.0/finder/pin/tryagroup`, this.groupId)
    .subscribe(
      success => {
        this.router.navigate([`/small-group/${this.groupId}`]);
        this.content.getContent('tryGroupRequestSuccess').subscribe(message => this.toast.success(message.content));
        this.state.setLoading(false);
      },
      failure => {
        if (failure.status === HttpStatusCodes.CONFLICT) {
          this.content.getContent('tryGroupRequestAlreadyRequestedFailureMessage').subscribe(message =>
            this.toast.error(message.content));

        } else {
          this.content.getContent('tryGroupRequestGeneralFailureMessage').subscribe(message =>
            this.toast.error(message.content));
        }
        this.state.setLoading(false);
      }
    );
  }
}
