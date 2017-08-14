import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SessionService } from '../../../services/session.service';
import { StateService } from '../../../services/state.service';

// TODO: Add error handling to HTTP post
// TODO: Define the URL of the backend endpoint and success page as constants
// import { TryGroupRequestBackendURL, TryGroupRequestSuccessURL } from '../../shared/constants';

@Component({
  selector: 'app-try-group-request-confirmation',
  templateUrl: 'try-group-request-confirmation.component.html'
})
export class TryGroupRequestConfirmationComponent implements OnInit {
  private baseUrl = process.env.CRDS_GATEWAY_CLIENT_ENDPOINT;
  private groupId: string;

  constructor(private sessionService: SessionService,
    private router: Router,
    private route: ActivatedRoute,
    private state: StateService
  ) {}

  ngOnInit() {
    this.state.setLoading(false);
    this.groupId = this.route.snapshot.paramMap.get('groupId');
  }

  public onCancel(): void {
    window.history.back();
  }

  public onSubmit(): void {
    this.sessionService.post(`${this.baseUrl}api/v1.0.0/finder/pin/tryagroup`, this.groupId)
    .subscribe(
      success => {
        console.log(`TryGroupRequestConfirmation: Submit succeeded, ${success}`);
        this.router.navigate([`/try-group-request-success/${this.groupId}`]);  // Redirect to success page
      },
      failure => {
        console.log(`TryGroupRequestConfirmation: Submit failed, ${failure}`);
      }
    );
  }

  public onClose(): void {
    window.history.back();
    // this.router.navigate([`/foo/${this.groupId}`]);
  }
}
