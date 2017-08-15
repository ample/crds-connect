import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { BlandPageService } from '../../../services/bland-page.service';
import { ParticipantService } from '../../../services/participant.service';
import { ToastsManager } from 'ng2-toastr';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { ProfileService } from '../../../services/profile.service';
import { GroupService } from '../../../services/group.service';
import { StateService } from '../../../services/state.service';
import { CreateGroupService } from '../create-group-data.service';
import { Pin, Participant } from '../../../models';
import { Component, OnInit } from '@angular/core';
import { ViewType, groupPaths, textConstants } from '../../../shared/constants';


@Component({
    selector: 'create-group-preview',
    templateUrl: './create-group-preview.component.html'
})
export class CreateGroupPreviewComponent implements OnInit {
    private smallGroupPin: Pin;
    private leaders: Participant[];
    private isComponentReady: boolean = false;
    private submitting: boolean = true;

    constructor(private createGroupService: CreateGroupService,
                private state: StateService,
                private groupService: GroupService,
                private profileService: ProfileService,
                private router: Router,
                private toastr: ToastsManager,
                private participantService: ParticipantService,
                private blandPageService: BlandPageService,
                private contentService: ContentService) { }

    ngOnInit() {
        let pageHeader = (this.state.getActiveGroupPath() === groupPaths.EDIT) ? textConstants.GROUP_PAGE_HEADERS.EDIT
                                                                               : textConstants.GROUP_PAGE_HEADERS.ADD;
        this.state.setPageHeader(pageHeader, '/create-group/page-6');

        this.smallGroupPin = this.createGroupService.getSmallGroupPinFromGroupData();
        this.leaders = this.createGroupService.getLeaders();
        this.isComponentReady = true;
        this.state.setLoading(false);
    }

    onSubmit(): void {
        this.state.setLoading(true);
        let group = this.createGroupService.prepareForGroupSubmission();

        if (this.state.getActiveGroupPath() === groupPaths.EDIT) {
            Observable.forkJoin(
                this.groupService.editGroup(group),
                this.profileService.postProfileData(this.createGroupService.profileData)
            )
            .subscribe((returnData) => {
                    this.toastr.success('Successfully edited group!');
                    this.state.postedPin = this.smallGroupPin;
                    this.state.setIsMyStuffActive(true);
                    this.state.setCurrentView(ViewType.LIST);
                    this.router.navigate(['/']);
        }, (error) => {
            console.log(error);
            this.toastr.error(this.contentService.getContent('generalError'));
            this.blandPageService.goToDefaultError('/create-group/preview');
        });

        this.createGroupService.reset();

    } else if (this.state.getActiveGroupPath() === groupPaths.ADD) {
            Observable.forkJoin(
                this.groupService.createGroup(group),
                this.participantService.getLoggedInUsersParticipantRecord(),
                this.profileService.postProfileData(this.createGroupService.profileData)
            )
            .subscribe((returnData) => {
                group.groupId = returnData[0].groupId;
                this.createGroupService.setParticipants(returnData[1], group);
                this.groupService.createParticipants(group)
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
            }, (error) => {
                console.log(error);
                this.toastr.error(this.contentService.getContent('generalError'));
                this.blandPageService.goToDefaultError('/create-group/preview');
            });
        }

    }

    onBack(): void {
        this.router.navigate(['/create-group/page-6']);
    }
}
