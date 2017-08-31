import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';

import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { SessionService } from '../../../services/session.service';
import { StateService } from '../../../services/state.service';

@Component({
  selector: 'app-end-group-confirmation',
  templateUrl: 'end-group-confirmation.component.html',
  styles: ['.fauxdal-wrapper { overflow-y: hidden; }']
})
export class EndGroupConfirmationComponent implements OnInit {
  private baseUrl = process.env.CRDS_GATEWAY_CLIENT_ENDPOINT;

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

  public onCancel(): void {
    window.history.back();
  }

  public onSubmit(): void {
    this.state.setLoading(true);
    this.sessionService.post(`${this.baseUrl}api/v1.0.0/finder/pin/tryagroup`, this.groupId)
    .subscribe(
      success => {
        this.router.navigate([`grouptool/${this.groupId}/endsmallgroup`]);
        this.toast.success(this.content.getContent('endGroupConfirmationSuccessMessage'));
        this.state.setLoading(false);
      },
      failure => {
        this.toast.error(this.content.getContent('endGroupConfirmationFailureMessage'));
        this.state.setLoading(false);
      }
    );
  }
}
