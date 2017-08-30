import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';

import { Pin, pinType } from '../../../models/pin';
import { User } from '../../../models/user';
import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../../models/bland-page-details';
import { Participant } from '../../../models/participant';
import { Address } from '../../../models/address';

import { AddressService } from '../../../services/address.service';
import { AppSettingsService } from '../../../services/app-settings.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { BlandPageService } from '../../../services/bland-page.service';
import { CreateGroupService } from '../../create-group/create-group-data.service';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { LoginRedirectService } from '../../../services/login-redirect.service';
import { PinService } from '../../../services/pin.service';
import { SessionService } from '../../../services/session.service';
import { StateService } from '../../../services/state.service';
import { ParticipantService } from '../../../services/participant.service';
import { ListHelperService } from '../../../services/list-helper.service';
import { TimeHelperService} from '../../../services/time-helper.service';

import { groupDescriptionLengthDetails, groupPaths, HttpStatusCodes } from '../../../shared/constants';
import { GroupRole } from '../../../shared/constants';
import * as moment from 'moment';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'gathering',
  templateUrl: 'gathering.html'
})
export class GatheringComponent implements OnInit {
  @Input() pin: Pin;
  @Input() user: Pin;
  @Input() isPinOwner: boolean = false;
  @Input() isLoggedIn: boolean = false;
  @Input() previewMode: boolean = false;
  @Input() leaders: Participant[] = [];
  public trialMemberApprovalMessage: string;
  public trialMemberApprovalError: boolean;

  private pinType: any = pinType;
  public isInGathering: boolean = false;
  public isLeader: boolean = false;
  public isInGroupApp: boolean;
  public sayHiButtonText: string = 'Contact host';
  private ready = false;
  public descriptionToDisplay: string;
  public doDisplayFullDesc: boolean;
  private participantEmails: string[];
  public adjustedLeaderNames: string[] = [];

  constructor(private app: AppSettingsService,
    private session: SessionService,
    private pinService: PinService,
    private router: Router,
    private loginRedirectService: LoginRedirectService,
    private blandPageService: BlandPageService,
    private createGroupService: CreateGroupService,
    private state: StateService,
    private participantService: ParticipantService,
    private toast: ToastsManager,
    private addressService: AddressService,
    private listHelperService: ListHelperService,
    private content: ContentService,
    private timeHlpr: TimeHelperService,
    private analtyics: AnalyticsService,
    public appSettingsService: AppSettingsService,
    private route: ActivatedRoute) { }

  public ngOnInit() {
    if (!this.previewMode) {
      window.scrollTo(0, 0);
      this.requestToJoin = this.requestToJoin.bind(this);
      this.state.setLoading(true);

      this.approveOrDisapproveTrialMember();

      this.isInGroupApp = this.app.isSmallGroupApp();
      let pageTitleOnHeader: string = this.app.isConnectApp() ? 'Gathering' : 'Group';
      this.state.setPageHeader(pageTitleOnHeader, '/');

      if (this.pin.gathering != null) {
        this.descriptionToDisplay = this.getDescriptionDisplayText();
        this.doDisplayFullDesc = this.displayFullDesc();
      }
      try {
        this.getParticipants(false);
      } catch (err) {
        console.log(err.message);
        this.blandPageService.goToDefaultError('');
      }
    } else {
      this.adjustedLeaderNames = this.getAdjustedLeaderNames(this.leaders, false);
      this.descriptionToDisplay = this.getDescriptionDisplayText();
      this.doDisplayFullDesc = this.displayFullDesc();
      this.ready = true;
    }
  }

  public getParticipants(forceRefresh: boolean) {
    this.participantService.getParticipants(this.pin.gathering.groupId, forceRefresh).subscribe(
      participants => {
        this.participantService.getAllLeaders(this.pin.gathering.groupId).subscribe((leaders) => {
          this.leaders = leaders;
        });
        this.pin.gathering.Participants = participants;
        this.participantEmails = participants.map(p => p.email);

        this.participantService.getCurrentUserGroupRole(this.pin.gathering.groupId).subscribe(
          role => {
            let isInGroup: boolean = role !== GroupRole.NONE;
            if (isInGroup) {
              this.isInGathering = true;
              this.isLeader = role === GroupRole.LEADER;

              this.addressService.getFullAddress(this.pin.gathering.groupId, pinType.GATHERING)
                .finally(() => {
                  this.state.setLoading(false);
                  this.ready = true;
                })
                .subscribe(
                address => {
                  this.pin.gathering.address = address;
                },
                error => {
                  this.toast.error(this.content.getContent('errorRetrievingFullAddress'));
                }
                );
            } else {
              // Not a participant of this group.
              this.state.setLoading(false);
              this.ready = true;
            }
            this.adjustedLeaderNames = this.getAdjustedLeaderNames(this.leaders, isInGroup);
          });
      },
      failure => {
        console.log('Could not get participants');
        this.blandPageService.goToDefaultError('');
      });
  }

  public approveOrDisapproveTrialMember() {
    const approved: boolean = (this.route.snapshot.params['approved'] === 'true');
    const trialMemberId: string = this.route.snapshot.params['trialMemberId'];

    const baseUrl = process.env.CRDS_GATEWAY_CLIENT_ENDPOINT;

    if (approved !== undefined && trialMemberId) {
      this.session.post(`${baseUrl}api/v1.0.0/finder/pin/tryagroup/${this.pin.gathering.groupId}/${approved}/${trialMemberId}`, null)
      .subscribe(
        success => {
          this.trialMemberApprovalMessage = approved ? 'Trial member was approved' : 'Trial member was disapproved';
          if ( approved ) {
            this.participantService.clearGroupFromCache(this.pin.gathering.groupId);
          }
          this.getParticipants(true);
        },
        failure => {
          if (failure.status === HttpStatusCodes.CONFLICT) {
            this.trialMemberApprovalMessage = 'This member has already been approved or denied';
          } else {
            this.trialMemberApprovalMessage = 'Error approving trial member';
          }

          this.trialMemberApprovalError = true;
        }
      );
    }
  }

  public getProximityString(): string {
    if (this.isOnlineGroup()) {
      return '(ONLINE GROUP)';
    } else if (this.pin.proximity) {
      return `(${this.pin.proximity.toFixed(1)} MI)`;
    } else {
      return '';
    }
  }

  public isOnlineGroup(): boolean {
    return this.pin.gathering.isVirtualGroup;
  }

  public showSocial(): boolean {
    return !(window.location.href.includes(groupPaths.EDIT) || window.location.href.includes(groupPaths.ADD));
  }

  public isPublicGroup(): boolean {
    return this.pin.gathering.availableOnline;
  }

  public onEditGroupClicked(groupId: number): void {
    this.state.setLoading(true);
    this.createGroupService.clearPresetDataFlagsOnGroupEdit();
    this.createGroupService.groupBeingEdited = null;
    this.createGroupService.reset();
    this.router.navigate([`edit-group/${groupId}/page-1`]);
  }

  private onTryThisGroupClicked(): void {
    this.state.setLoading(true);
    this.router.navigate([`try-group-request-confirmation/${this.pin.gathering.groupId}`]);
  }

  private onContactLeaderClicked(): void {
    this.state.setLoading(true);
    let contactLeaderOfThisGroupPageUrl: string = 'contact-leader/' + this.pin.gathering.groupId;
    this.router.navigate([contactLeaderOfThisGroupPageUrl]);
  }

  public getMeetingTime(meetingTimeUtc: string) {
    // Sorry this is here. We don't need to do moment when we're doing create group :(
    if (!this.previewMode) {
      return this.timeHlpr.getLocalTimeFromUtcStringOrDefault(meetingTimeUtc, true);
    } else {
      return this.timeHlpr.hackTime(meetingTimeUtc);
    }
  }

  private getAdjustedLeaderNames(leaders: Participant[], isUserParticipant: boolean): string[] {
    let adjustedLeaderNames: string[] = [];
    leaders.forEach((leader) => {
      let adjustedName: string = isUserParticipant ? `${leader.nickName} ${leader.lastName}` : `${leader.nickName} ${leader.lastName.slice(0, 1)}.`;
      adjustedLeaderNames.push(adjustedName);
    });
    return adjustedLeaderNames;
  }

  public requestToJoin() {
    let isConnectApp = this.app.isConnectApp();
    let successBodyContentBlock: string = isConnectApp ? 'finderGatheringJoinRequestSent' : 'finderGroupJoinRequestSent';

    (isConnectApp) ? this.analtyics.joinGathering() : this.analtyics.joinGroup();

    if (this.session.isLoggedIn()) {
      this.state.setLoading(true);
      this.pinService.requestToJoinGathering(this.pin.gathering.groupId)
        .subscribe(
        success => {
          this.blandPageService.primeAndGo(new BlandPageDetails(
            'Return to map',
            successBodyContentBlock,
            BlandPageType.ContentBlock,
            BlandPageCause.Success,
            ''
          ));
        },
        failure => {
          this.state.setLoading(false);
          if (failure.status === 409) {
            this.toast.warning(this.content.getContent('finderAlreadyRequestedJoin'));
          } else if (failure.status === 406) {
            // Already in group...do nothing.
          } else {
            this.toast.error(this.content.getContent('generalError'));
          }
          // If we're at the signin or register page, come back to the gathering details.
          if (!this.router.url.includes('gathering')) {
            this.loginRedirectService.redirectToTarget();
          }
        }
        );
    } else {
      this.loginRedirectService.redirectToLogin(this.router.routerState.snapshot.url, this.requestToJoin);
    }
  }

  public edit() {
    this.router.navigate(['/gathering', this.pin.gathering.groupId, 'edit']);
  }

  public getDescriptionDisplayText(): string {
    if (this.doDisplayFullDesc === true || this.pin.gathering.groupDescription.length < groupDescriptionLengthDetails) {
      return this.pin.gathering.groupDescription;
    } else {
      return this.listHelperService.truncateTextEllipsis(this.pin.gathering.groupDescription, groupDescriptionLengthDetails);
    }
  }

  public displayFullDesc(): boolean {
    return (this.pin.gathering.groupDescription.length < groupDescriptionLengthDetails) ? true : false;
  }

  public expandGroupDescription(): void {
    this.doDisplayFullDesc = true;
    this.descriptionToDisplay = this.getDescriptionDisplayText();
  }

  public displayKidsWelcome(kidsWelcome: boolean): string {
    return kidsWelcome ? 'Yes' : 'No';
  }

}
