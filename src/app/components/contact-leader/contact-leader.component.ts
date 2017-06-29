import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastsManager } from 'ng2-toastr';
import { LeadershipApplicationType, GroupLeaderApplicationStatus, LeaderStatus } from '../../shared/constants';
import { AddressService } from '../../services/address.service';
import { AppSettingsService } from '../../services/app-settings.service';
import { BlandPageService } from '../../services/bland-page.service';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { GroupService } from '../../services/group.service';
import { HostApplicationHelperService } from '../../services/host-application-helper.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { StoreService } from '../../services/store.service';

@Component({
    selector: 'contact-leader',
    templateUrl: 'contact-leader.component.html'
})
export class ContactLeaderComponent implements OnInit {

  public contactLeaderForm: FormGroup;
  public isFormSubmitted: boolean = false;
  private subject: string = '';
  private message: string = '';

  constructor(
    private addressService: AddressService,
    private blandPageService: BlandPageService,
    private content: ContentService,
    private hlpr: HostApplicationHelperService,
    private fb: FormBuilder,
    private location: Location,
    private loginRedirectService: LoginRedirectService,
    private route: ActivatedRoute,
    private router: Router,
    private session: SessionService,
    private store: StoreService,
    private toast: ToastsManager,
    private state: StateService,
    private appSettingsService: AppSettingsService,
    private groupService: GroupService) {}

  public ngOnInit() {
    this.state.setLoading(false);
    this.contactLeaderForm = new FormGroup({
      subject: new FormControl(this.subject, [Validators.required]),
      message: new FormControl(this.message, [Validators.required]),
    });
  }

  public ngAfterViewInit() {
    // This component is rendered within a fauxdal,
    // so we need the following selector added to <body> element
    document.querySelector('body').classList.add('fauxdal-open');
  }

  private onSubmit() {
    console.log('Form submited');
  }

  private closeClick() {
    this.location.back();
  }

}
