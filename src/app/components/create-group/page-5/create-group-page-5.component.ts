import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { GroupService} from '../../../services/group.service';
import { StateService } from '../../../services/state.service';
import { CreateGroupService } from '../create-group-data.service';

import {  GroupPaths, groupPaths, GroupPageNumber,
          textConstants  } from '../../../shared/constants';

@Component({
    selector: 'create-group-page-5',
    templateUrl: './create-group-page-5.component.html',
    styles: ['.btn-group-block .row > div { width: 100%; }']
})
export class CreateGroupPage5Component implements OnInit {
  public groupDetailsForm: FormGroup;

  private isComponentReady: boolean = false;
  private isSubmitted: boolean = false;

  constructor(private fb: FormBuilder,
    private groupService: GroupService,
    private state: StateService,
    private createGroupService: CreateGroupService,
    private router: Router) {}

  ngOnInit(): void {
    let pageHeader = (this.state.getActiveGroupPath() === groupPaths.EDIT) ? textConstants.GROUP_PAGE_HEADERS.EDIT
                                                                           : textConstants.GROUP_PAGE_HEADERS.ADD;

    let headerBackRoute: string = (this.state.getActiveGroupPath() === groupPaths.EDIT) ?
      `/edit-group/${this.createGroupService.groupBeingEdited.groupId}/page-4`
      : '/create-group/page-4';

    this.state.setPageHeader(pageHeader, headerBackRoute);

    this.groupDetailsForm = this.fb.group({
      groupName: [this.createGroupService.group.groupName, Validators.required],
      groupDescription: [this.createGroupService.group.groupDescription, Validators.required],
      availableOnline: [this.createGroupService.group.availableOnline, Validators.required]
    });

    this.state.setLoading(false);
  }

  public onSetGroupPrivacy(value: boolean): void {
    this.createGroupService.group.availableOnline = value;
  }

  public onSubmit(form: FormGroup): void {
    this.state.setLoading(true);
    this.isSubmitted = true;
    if (form.valid && this.createGroupService.group.availableOnline != null) {
      this.groupService.navigateInGroupFlow(GroupPageNumber.SIX, this.state.getActiveGroupPath(), this.createGroupService.group.groupId);
    } else {
      this.state.setLoading(false);
    }
  }

  public onBack(): void {
    this.groupService.navigateInGroupFlow(GroupPageNumber.FOUR, this.state.getActiveGroupPath(), this.createGroupService.group.groupId);
  }
}
