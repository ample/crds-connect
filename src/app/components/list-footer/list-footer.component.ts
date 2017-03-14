import { Component, OnInit, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { Address } from '../../models/address'; //DELETE - ONLY FOR MOCK CODE
import { ListHelperService } from '../../services/list-helper.service';
import { Pin, pinType } from '../../models/pin';
import { SessionService } from '../../services/session.service';
import { UserState } from '../../shared/constants';

@Component({
  selector: 'list-footer',
  templateUrl: 'list-footer.component.html',
  styleUrls: ['list-footer.component.css']
})
export class ListFooterComponent implements OnInit {

  @Input() pins: Array<Pin>;

  public userContactId: number = null;
  public userMapState: UserState = undefined;
  public userMapStateEnum = UserState;

  constructor(private listHlpr: ListHelperService,
              private router: Router,
              private session: SessionService) {}

  public ngOnInit(): void {}

  ngOnChanges(): void {
    this.userContactId = this.session.getContactId();
    this.userMapState = this.listHlpr.getUserMapState(this.userContactId, this.pins);
  }

  public myPinBtnClicked(userMapState: UserState)  {
    this.router.navigateByUrl('/add-me-to-the-map');
  }

  public whatsAHostBtnClicked()  {
    this.router.navigateByUrl('/whats-a-host');
  }

}

