import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SessionService } from '../../../services/session.service';
import { StateService } from '../../../services/state.service';

import { HttpStatusCodes } from '../../../shared/constants';

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
  private errorMessage: string;

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
        this.router.navigate([`/try-group-request-success/${this.groupId}`]);  // Redirect to success page
        this.errorMessage = undefined;
      },
      failure => {
        if(failure.status === HttpStatusCodes.CONFLICT) {
          this.errorMessage = 'You have already requested to try this group.'
        } else {
          this.errorMessage = 'Request to try this group failed.'
        }
      }
    );
  }

  public onClose(): void {
    window.history.back();
  }
}
