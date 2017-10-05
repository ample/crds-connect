import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';

import { ContentService } from 'crds-ng2-content-block';
import { SessionService } from '../../../../services/session.service';
import { StateService } from '../../../../services/state.service';
import { ParticipantService } from '../../../../services/participant.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-end-group-confirmation',
  templateUrl: 'end-group-confirmation.component.html',
  styles: ['.fauxdal-wrapper { overflow-y: hidden; }']
})
export class EndGroupConfirmationComponent implements OnInit {
  private baseUrl = environment.CRDS_GATEWAY_CLIENT_ENDPOINT;
  private groupId: string;

  constructor(private sessionService: SessionService,
    private router: Router,
    private route: ActivatedRoute,
    private state: StateService,
    private toast: ToastsManager,
    private content: ContentService,
    private participantService: ParticipantService
  ) {}

  ngOnInit() {
    this.state.setLoading(false);
    this.groupId = this.route.snapshot.params['groupId'];
    document.querySelector('body').style.overflowY = 'hidden';
  }

  public onCancel(): void {
    window.history.back();
  }

  public onClose(): void {
    window.history.back();
  }

  public onEndGroup(): void {
    this.state.setLoading(true);
    this.sessionService.post(`${this.baseUrl}api/v1.0.0/grouptool/${this.groupId}/endsmallgroup`, null)
    .subscribe(
      success => {
        this.participantService.clearGroupFromCache(Number(this.groupId));
        this.router.navigate(['/my']);
        this.content.getContent('endGroupConfirmationSuccessMessage').subscribe(message => this.toast.success(message.content));
        this.state.setLoading(false);
      },
      failure => {
        this.content.getContent('endGroupConfirmationFailureMessage').subscribe(message => this.toast.error(message.content));
        this.state.setLoading(false);
      }
    );
  }
}
