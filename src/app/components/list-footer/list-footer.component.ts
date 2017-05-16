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

@Component({
  selector: 'list-footer',
  templateUrl: 'list-footer.component.html'
})
export class ListFooterComponent implements OnInit, OnChanges {

  @Input() pins: Array<Pin>;

  public userContactId: number = null;
  public userMapState: UserState = undefined;
  public userMapStateEnum = UserState;

  constructor(private listHlpr: ListHelperService,
              private router: Router,
              private session: SessionService,
              public state: StateService,
              private blandPageService: BlandPageService,
              private pinLabelService: PinLabelService) {}

  public ngOnInit(): void {}

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

// TODO - need to pull this to a higher level service - make sure the parameter is myStuffPins - not just results pins
// should the basic list view footer behave the same way as the MY Stuff list view footer?? 
  private isLeadingAny(myStuffPins: Array<Pin>): boolean {
    if (this.state.getMyViewOrWorldView() === 'my') {
      return this.pinLabelService.isLeadingAny(myStuffPins);
    }
    return false;
  }
}

