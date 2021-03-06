import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { BlandPageService } from '../../../services/bland-page.service';
import { ParticipantService } from '../../../services/participant.service';
import { ToastsManager } from 'ng2-toastr';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { PinService } from '../../../services/pin.service';
import { ProfileService } from '../../../services/profile.service';
import { StateService } from '../../../services/state.service';
import { CreateGroupService } from '../create-group-data.service';
import { Pin, Participant } from '../../../models';
import { Component, OnInit } from '@angular/core';
import { ViewType, groupPaths, GroupPageNumber, textConstants } from '../../../shared/constants';

@Component({
  selector: 'create-group-preview',
  templateUrl: './create-group-preview.component.html'
})
export class CreateGroupPreviewComponent implements OnInit {
  public smallGroupPin: Pin;
  public leaders: Participant[];
  public isComponentReady: boolean = false;
  public submitting: boolean = true;

  constructor(
    private createGroupService: CreateGroupService,
    private state: StateService,
    private profileService: ProfileService,
    private pinService: PinService,
    private router: Router,
    private toastr: ToastsManager,
    private participantService: ParticipantService,
    private blandPageService: BlandPageService,
    private contentService: ContentService
  ) {}

  ngOnInit() {
    const pageHeader =
      this.state.getActiveGroupPath() === groupPaths.EDIT
        ? textConstants.GROUP_PAGE_HEADERS.EDIT
        : textConstants.GROUP_PAGE_HEADERS.ADD;

    const headerBackRoute: string =
      this.state.getActiveGroupPath() === groupPaths.EDIT
        ? `/edit-group/${this.createGroupService.groupBeingEdited.groupId}/page-6`
        : '/create-group/page-6';

    this.state.setPageHeader(pageHeader, headerBackRoute);

    this.smallGroupPin = this.createGroupService.getSmallGroupPinFromGroupData();
    this.createGroupService.getLeaders().subscribe(
      leaders => {
        this.leaders = leaders;
      },
      error => {
        console.log('Error getting group leaders.');
      }
    );

    this.isComponentReady = true;
    this.state.setLoading(false);
  }

  onSubmit(): void {
    this.state.setLoading(true);
    const group = this.createGroupService.prepareForGroupSubmission();

    if (this.state.getActiveGroupPath() === groupPaths.EDIT) {
      group.startDate = this.createGroupService.groupBeingEdited.startDate;
      Observable.forkJoin(
        this.pinService.editGroup(group),
        this.profileService.postProfileData(this.createGroupService.profileData)
      ).subscribe(
        returnData => {
          this.toastr.success('Successfully edited group!');
          this.state.postedPin = this.smallGroupPin;
          this.state.setIsMyStuffActive(true);
          this.state.setCurrentView(ViewType.LIST);

          this.router.navigate([`/small-group/${group.groupId}`]);
        },
        error => {
          console.log(error);
          this.contentService.getContent('finderGeneralError').subscribe(message => this.toastr.error(message.content));
          this.blandPageService.goToDefaultError('/create-group/preview');
        }
      );

      this.createGroupService.reset();
    } else if (this.state.getActiveGroupPath() === groupPaths.ADD) {
      Observable.forkJoin(
        this.pinService.createGroup(group),
        this.participantService.getLoggedInUsersParticipantRecord(),
        this.profileService.postProfileData(this.createGroupService.profileData)
      ).subscribe(
        returnData => {
          group.groupId = returnData[0].groupId;
          this.createGroupService.setParticipants(returnData[1], group);
          this.participantService
            .createParticipants(group)
            .finally(() => {
              this.createGroupService.reset();
            })
            .subscribe(() => {
              this.toastr.success('Successfully created group!');
              this.state.postedPin = this.smallGroupPin;
              this.state.setIsMyStuffActive(true);
              this.state.setCurrentView(ViewType.LIST);
              this.router.navigate(['/']);
            });
        },
        error => {
          console.log(error);
          this.contentService.getContent('finderGeneralError').subscribe(message => this.toastr.error(message.content));
          this.blandPageService.goToDefaultError('/create-group/preview');
        }
      );
    }
  }

  onBack(): void {
    this.createGroupService.navigateInGroupFlow(
      GroupPageNumber.SIX,
      this.state.getActiveGroupPath(),
      this.createGroupService.group.groupId
    );
  }
}
