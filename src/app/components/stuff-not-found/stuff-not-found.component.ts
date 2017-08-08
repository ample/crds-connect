import { StateService } from '../../services/state.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AppSettingsService } from '../../services/app-settings.service';
import { GroupService } from '../../services/group.service';

import { GroupResourcesUrl, GroupLeaderApplicationStatus } from '../../shared/constants';

@Component({
  selector: 'stuff-not-found',
  templateUrl: 'stuff-not-found.html'
})
export class StuffNotFoundComponent implements OnInit {
  public isApprovedLeader: boolean = false;

  constructor(private state: StateService,
              private appSettings: AppSettingsService,
              private groupService: GroupService ) { }

  public ngOnInit() {
    this.state.setPageHeader(this.appSettings.myStuffName, '/');
    this.state.setLoading(false);

    this.groupService.getLeaderStatus()
      .subscribe(status => {
        if (status.status === GroupLeaderApplicationStatus.APPROVED) {
          this.isApprovedLeader = true;
        } else {
          this.isApprovedLeader = false;
          }
        });

  }

  public onGroupResourcesClicked() {
    window.location.href = GroupResourcesUrl;
  }

}
