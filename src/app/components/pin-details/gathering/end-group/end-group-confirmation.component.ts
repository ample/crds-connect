import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';

import { SessionService } from '../../../services/session.service';
import { StateService } from '../../../services/state.service';

@Component({
  selector: 'app-end-group-confirmation',
  templateUrl: 'end-group-confirmation.component.html',
  styles: ['.fauxdal-wrapper { overflow-y: hidden; }']
})
export class EndGroupConfirmationComponent implements OnInit {
  @Input groupId: string;
  private baseUrl = process.env.CRDS_GATEWAY_CLIENT_ENDPOINT;

  constructor(private sessionService: SessionService,
    private router: Router,
    private state: StateService,
    private toast: ToastsManager,
    private content: ContentService
  ) {}

  ngOnInit() {
    this.state.setLoading(false);
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
        this.router.navigate([`/small-group/${this.groupId}`]);
        this.toast.success(___success message___);
        this.state.setLoading(false);
      },
      failure => {
        this.toast.error(___failure message___);
        this.state.setLoading(false);
      }
    );
  }
}
