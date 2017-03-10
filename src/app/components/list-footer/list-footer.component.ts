import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-list-footer',
  templateUrl: 'list-footer.component.html',
  styleUrls: ['list-footer.component.css']
})
export class ListFooterComponent {

  public userContactId: number = null;

  constructor(private router: Router,
              session: SessionService) {
    this.userContactId = session.getContactId();
    console.log(this.userContactId);
  }

  //determine whether the user is logged in, or not logged in
  //if logged in, whether on map or not

  //set state
  //1 Not logged in
  //2 Logged in / not on map
  //3 Logged in / on map

  public myPinBtnClicked()  {
    this.router.navigateByUrl('/add-me-to-the-map');
  }
}

