import { Angulartics2 } from 'angulartics2';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { APIService } from '../../services/api.service';
import { ContentService } from '../../services/content.service';
import { Pin } from '../../models/pin';
import { Address } from '../../models/address';
import { StateService } from '../../services/state.service';
import { StoreService } from '../../services/store.service';
import { SessionService } from '../../services/session.service';
import { AddMeToTheMapHelperService } from '../../services/add-me-to-map-helper.service';


@Component({
  selector: 'app-pin-detail',
  templateUrl: 'pin-details.html'
})
export class PinDetailsComponent implements OnInit {

  public form: FormGroup;
  public submitted: boolean = false;
  public errorMessage: string = '';
  public buttonText: string = "Update";
  public isLoggedInUser: boolean = false;
  public isLoggedIn: boolean = false;
  public editMode: boolean = false;
  public pin: Pin;
  public isGatheringPin: boolean = false;
  public sayHiText: string = '';
  public isInGathering: boolean = false;


  constructor(private api: APIService,
    private content: ContentService,
    private router: Router,
    private route: ActivatedRoute,
    private session: SessionService,
    private state: StateService,
    private hlpr: AddMeToTheMapHelperService
  ) {
  }

  public ngOnInit() {
    this.state.setLoading(true);
    //I think this is bad
    //We are just appending a bunch of properties to our pin class, not necessarily composing a
    //new pin via a constructor.  This should be rectified.
    this.pin = this.route.snapshot.data['pin'];

    if (this.pin.gathering !== null && this.pin.gathering !== undefined) {
      this.isGatheringPin = true;
    }

    if (this.api.isLoggedIn()) {
      this.isLoggedIn = true;
      this.isLoggedInUser = this.doesLoggedInUserOwnPin();
    }
    this.state.setLoading(false);
  }

  public sayHi() {
    console.log('hi');
  }

  public edit() {
    this.editMode = true;
  }

  private doesLoggedInUserOwnPin() {
    let contactId = this.session.getContactId();
    return contactId === this.pin.contactId;
  }

  public onSubmit(value) {
    if (value) {
      location.reload();
    }
  }

}
