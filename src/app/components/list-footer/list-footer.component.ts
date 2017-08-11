import { Component, OnInit, OnChanges, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { AppSettingsService } from '../../services/app-settings.service';
import { BlandPageService } from '../../services/bland-page.service';
import { ListHelperService } from '../../services/list-helper.service';
import { ParticipantService } from '../../services/participant.service';
import { PinLabelService } from '../../services/pin-label.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';

import { Pin } from '../../models/pin';
import { UserState, GroupResourcesUrl, LeaderResourcesUrl, ViewType } from '../../shared/constants';

@Component({
  selector: 'list-footer',
  templateUrl: 'list-footer.component.html'
})
export class ListFooterComponent implements OnInit, OnChanges {

  @Input() pins: Array<Pin>;

  public doesUserLeadAnyGroups: boolean;
  public isReadyToDisplayComponent: boolean = false;
  public isUserHostingAnyGatheringsOrGroups: boolean = false;
  public isSmallGroupApp: boolean = false;
  public userContactId: number = null;
  public userMapState: UserState = undefined;
  public userMapStateEnum = UserState;
  public isMyView: boolean = false;
  private isMyStuffActiveSub: Subscription;

  constructor(private listHlpr: ListHelperService,
              private router: Router,
              private session: SessionService,
              public state: StateService,
              private blandPageService: BlandPageService,
              private participantService: ParticipantService,
              private pinLabelService: PinLabelService,
              private appSettings: AppSettingsService) {}

  public ngOnInit(): void {
    this.isSmallGroupApp = this.appSettings.isSmallGroupApp();
    this.getNecessaryDataAndInit();
    this.isUserHostingAnyGatheringsOrGroups = this.pinLabelService.isHostingAny(this.pins);
    this.isMyView = this.state.myStuffActive;
    this.isMyStuffActiveSub = this.state.myStuffStateChangedEmitter.subscribe((isMyStuffActive) => {
      this.isMyView = isMyStuffActive;
    });
  }

  ngOnChanges(): void {
    this.userContactId = this.session.getContactId();
    this.userMapState = this.listHlpr.getUserMapState(this.userContactId, this.pins);
  }

  public getNecessaryDataAndInit(): void {

    if (this.isSmallGroupApp) {
      this.participantService.doesUserLeadAnyGroups().subscribe(
        doesUserLeadAnyGroups => {
          this.doesUserLeadAnyGroups = doesUserLeadAnyGroups as boolean;
          this.isReadyToDisplayComponent = true;
        },
        err => {
          this.doesUserLeadAnyGroups = false;
          this.isReadyToDisplayComponent = true;
        },
      );
    } else {
      this.isReadyToDisplayComponent = true;
    }
  }

  public addMeToTheMapClicked()  {
    this.state.setCurrentView(ViewType.LIST);
    this.router.navigateByUrl('/add-me-to-the-map');
  }

  public becomeAHostClicked()  {
    this.state.setCurrentView(ViewType.LIST);
    this.router.navigateByUrl('/host-signup');
  }

  public whatsAHostBtnClicked()  {
    this.state.setCurrentView(ViewType.LIST);
    this.blandPageService.goToWhatsAHost();
  }

  public onBecomeALeaderClicked() {
    this.state.setCurrentView(ViewType.LIST);
    this.router.navigateByUrl('/create-group');
  }

  public onCreateAGroupClicked() {
    this.state.setCurrentView(ViewType.LIST);
    this.router.navigateByUrl('/create-group');
  }

  public onLeaderResourcesClicked() {
    window.location.href = LeaderResourcesUrl;
  }

  public onGroupResourcesClicked() {
    window.location.href = GroupResourcesUrl;
  }
}
