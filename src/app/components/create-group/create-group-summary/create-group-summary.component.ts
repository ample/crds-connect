import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {StateService} from '../../../services/state.service';
import {CreateGroupService} from '../create-group-data.service';

import {textConstants} from '../../../shared/constants';

@Component({
  selector: 'create-group-summary',
  templateUrl: './create-group-summary.component.html',
})
export class CreateGroupSummaryComponent implements OnInit {
  constructor(private createGroupService: CreateGroupService,
              private state: StateService,
              private router: Router) {
  }

  ngOnInit() {
    this.state.setLoading(true);
    this.state.setPageHeader(textConstants.GROUP_PAGE_HEADERS.ADD, '/');
    this.state.setLoading(false);
  }

  public onCreateGroupClicked() {
    this.createGroupService.clearPresetDataFlagsOnGroupEdit();
    this.createGroupService.groupBeingEdited = null;
    this.createGroupService.reset();
    this.router.navigate(['/create-group/page-1']);
  }
}
