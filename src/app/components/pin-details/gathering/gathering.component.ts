import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';

import { Pin, pinType } from '../../../models/pin';
import { User } from '../../../models/user';
import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../../models/bland-page-details';
import { Participant } from '../../../models/participant';
import { Address } from '../../../models/address';

import { AppSettingsService } from '../../../services/app-settings.service';
import { BlandPageService } from '../../../services/bland-page.service';
import { LoginRedirectService } from '../../../services/login-redirect.service';
import { PinService } from '../../../services/pin.service';
import { SessionService } from '../../../services/session.service';
import { StateService } from '../../../services/state.service';
import { ParticipantService } from '../../../services/participant.service';
import { AddressService } from '../../../services/address.service';
import { ListHelperService } from '../../../services/list-helper.service';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { groupDescriptionLengthDetails } from '../../../shared/constants';
import { GroupRole } from '../../../shared/constants';

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

  private pinType: any = pinType;
  public isInGathering: boolean = false;
  public isLeader: boolean = false;
  public sayHiButtonText: string = 'Contact host';
  private ready = false;
  private address: Address = Address.overload_Constructor_One();
  public descriptionToDisplay: string;
  public doDisplayFullDesc: boolean;
  private leaders: Participant[] = [];

  constructor(private app: AppSettingsService,
    private session: SessionService,
    private pinService: PinService,
    private router: Router,
    private loginRedirectService: LoginRedirectService,
    private blandPageService: BlandPageService,
    private state: StateService,
    private participantService: ParticipantService,
    private toast: ToastsManager,
    private addressService: AddressService,
    private listHelperService: ListHelperService,
    private content: ContentService,
    private angulartics2: Angulartics2,
    public appSettingsService: AppSettingsService) { }

  //ONINIT is doing WAY too much, needs to be simplified and broken up.
  public ngOnInit() {
    window.scrollTo(0, 0);
    this.requestToJoin = this.requestToJoin.bind(this);
    this.state.setLoading(true);

    let pageTitleOnHeader: string = this.app.isConnectApp() ? 'Gathering' : 'Group';
    this.state.setPageHeader(pageTitleOnHeader, '/');

    if (this.pin.gathering != null) {
      this.descriptionToDisplay = this.getDescriptionDisplayText();
      this.doDisplayFullDesc = this.displayFullDesc();
    }
    try {
      this.participantService.getParticipants(this.pin.gathering.groupId).subscribe(
        participants => {
          this.participantService.getAllLeaders(this.pin.gathering.groupId).subscribe((leaders) => {
            this.leaders = leaders;
          });
          this.pin.gathering.Participants = participants;
          this.participantService.getIsCurrentUserInGroup(this.pin.gathering.groupId).subscribe(
            role => {
              console.log(role);
              if (role !== GroupRole.NONE) {
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
                this.state.setLoading(false);
                this.ready = true;
              }
            });
        },
        failure => {
          console.log('Could not get participants');
          this.blandPageService.goToDefaultError('');
        });
    } catch (err) {
      console.log(err.message)
      this.blandPageService.goToDefaultError('');
    }
  }

  public requestToJoin() {
    let successBodyContentBlock: string = this.app.isConnectApp() ? 'finderGatheringJoinRequestSent' : 'finderGroupJoinRequestSent';
    this.angulartics2.eventTrack.next({ action: 'Join Gathering Button Click', properties: { category: 'Connect' } });
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
