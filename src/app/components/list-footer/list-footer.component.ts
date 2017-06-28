import { Angulartics2 } from 'angulartics2';

import { Component, OnInit, OnChanges, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { ListHelperService } from '../../services/list-helper.service';
import { Pin } from '../../models/pin';
import { PinLabelService } from '../../services/pin-label.service';
import { StateService } from '../../services/state.service';
import { SessionService } from '../../services/session.service';
import { UserState } from '../../shared/constants';
import { BlandPageService } from '../../services/bland-page.service';
import { AppSettingsService } from '../../services/app-settings.service';

@Component({
  selector: 'list-footer',
  templateUrl: 'list-footer.component.html'
})
export class ListFooterComponent implements OnInit, OnChanges {

  @Input() pins: Array<Pin>;

  public isUserHostingAnyGatheringsOrGroups: boolean = false;
  public userContactId: number = null;
  public userMapState: UserState = undefined;
  public userMapStateEnum = UserState;
  public isSmallGroupApp: boolean = false;

  constructor(private listHlpr: ListHelperService,
              private router: Router,
              private session: SessionService,
              public state: StateService,
              private blandPageService: BlandPageService,
              private pinLabelService: PinLabelService,
              private appSettings: AppSettingsService) {}

  public ngOnInit(): void {
    this.isUserHostingAnyGatheringsOrGroups = this.pinLabelService.isHostingAny(this.pins);
    this.isSmallGroupApp = this.appSettings.isSmallGroupApp();
  }

  ngOnChanges(): void {
    this.userContactId = this.session.getContactId();
    this.userMapState = this.listHlpr.getUserMapState(this.userContactId, this.pins);
  }

  public addMeToTheMapClicked()  {
    this.state.setCurrentView('list');
    this.router.navigateByUrl('/add-me-to-the-map');
  }

  public becomeAHostClicked()  {
    this.state.setCurrentView('list');
    this.router.navigateByUrl('/host-signup');
  }

  public whatsAHostBtnClicked()  {
    this.state.setCurrentView('list');
    this.blandPageService.goToWhatsAHost();
  }

  public createAGroupClicked()  {
    this.state.setCurrentView('list');
// create a group parent component    
// Not approved goes to group leader approved
// Approved goes to create a group
    this.router.navigateByUrl('/');
  }

}
