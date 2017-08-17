import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SessionService } from '../../../services/session.service';
import { StateService } from '../../../services/state.service';

import { HttpStatusCodes } from '../../../shared/constants';

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
    this.groupId = this.route.snapshot.params['groupId'];
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
        this.router.navigate([`/try-group-request-success/${this.groupId}`]);
        this.errorMessage = undefined;
        this.state.setLoading(false);
      },
      failure => {
        if(failure.status === HttpStatusCodes.CONFLICT) {
          this.errorMessage = 'tryGroupRequestAlreadyRequestedFailureMessage';
        } else {
          this.errorMessage = 'tryGroupRequestGeneralFailureMessage';
        }
        this.state.setLoading(false);
      }
    );
  }
}
