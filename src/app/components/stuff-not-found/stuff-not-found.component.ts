import { StateService } from '../../services/state.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AppSettingsService } from '../../services/app-settings.service';
import { PinService } from '../../services/pin.service';
import { ParticipantService } from '../../services/participant.service';

import { appType, GroupResourcesUrl, GroupLeaderApplicationStatus } from '../../shared/constants';

@Component({
  selector: 'stuff-not-found',
  templateUrl: 'stuff-not-found.html'
})
export class StuffNotFoundComponent implements OnInit {
  public isApprovedLeader: boolean = false;
  public isConnectApp: boolean;
  constructor(
    private state: StateService,
    private appSettings: AppSettingsService,
    private participantService: ParticipantService,
    private pinService: PinService,
    private router: Router
  ) {}

  public ngOnInit() {
    this.isConnectApp = this.appSettings.isConnectApp();
    this.state.setPageHeader(this.appSettings.myStuffName, '/');
    this.state.setLoading(false);

    this.participantService.getLeaderStatus().subscribe(status => {
      if (status.status === GroupLeaderApplicationStatus.APPROVED) {
        this.isApprovedLeader = true;
      } else {
        this.isApprovedLeader = false;
      }
    });
  }

  public onFindAGroupClicked(): void {
    // clear is required is user is prompted to log in when click "My Groups"" for the first time
    this.pinService.clearPinCache();
    this.router.navigate(['/']);
  }

  public onGroupResourcesClicked(): void {
    window.location.href = GroupResourcesUrl;
  }
  public onAddMeToMapClicked(): void {
    this.router.navigateByUrl('/add-me-to-the-map');
  }
}
