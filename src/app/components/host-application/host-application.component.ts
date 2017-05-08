import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastsManager } from 'ng2-toastr';

import { BlandPageService } from '../../services/bland-page.service';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { HostApplicationHelperService } from '../../services/host-application-helper.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { StoreService } from '../../services/store.service';

import { Address } from '../../models/address';
import { HostRequestDto } from '../../models/host-request-dto';
import { HostApplicatonForm } from '../../models/host-application-form';
import { DetailedUserData } from '../../models/detailed-user-data';

@Component({
  selector: 'app-host-application',
  templateUrl: 'host-application.component.html'
})
export class HostApplicationComponent implements OnInit {

  public userData: DetailedUserData;
  public hostForm: FormGroup;
  public homeAddress: Address;
  public groupAddress: Address;
  public isFormSubmitted: boolean = false;
  public errorMessage: string = '';
  public groupName: string = 'groupAddress';

  constructor(
    private blandPageService: BlandPageService,
    private content: ContentService,
    private hlpr: HostApplicationHelperService,
    private loginRedirectService: LoginRedirectService,
    private route: ActivatedRoute,
    private router: Router,
    private session: SessionService,
    private store: StoreService,
    private toast: ToastsManager,
    private state: StateService,
    private location: Location
  ) {}

  public ngOnInit() {
    this.userData = this.route.snapshot.data['userData'];
    let mobilePhone: string = this.hlpr.formatPhoneForUi(this.userData.mobilePhone);
    this.homeAddress = this.userData.address;
    this.groupAddress = new Address(null, '', '', '', '', '', null, null, null, null);

    let gatheringDescriptionPlaceholder: string =
        this.hlpr.stripHtmlFromString(this.content.getContent('defaultGatheringDesc'));

    this.hostForm = new FormGroup({
      isHomeAddress: new FormControl(true, [Validators.required]),
      contactNumber: new FormControl(mobilePhone, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      gatheringDescription: new FormControl(gatheringDescriptionPlaceholder, [Validators.required, Validators.maxLength(500)])
    });

    this.state.setLoading(false);
  }

  public ngAfterViewInit() {
    // This component is rendered within a fauxdal,
    // so we need the following selector added to <body> element
    document.querySelector('body').classList.add('fauxdal-open');
  }

  public onIsHomeAddressClicked() {
    if (!this.hostForm.value.isHomeAddress) {
      this.hostForm.removeControl(this.groupName);
    }
  }

  public onSubmit ({ value, valid }: { value: HostApplicatonForm, valid: boolean }) {

    this.isFormSubmitted = true;
    if (valid) {
      this.state.setLoading(true);
      this.submitFormToApi(value);
    }
  }

  public submitFormToApi(formData: HostApplicatonForm) {

    let dto: HostRequestDto = this.hlpr.convertFormToDto(formData, this.userData.contactId);

    this.session.postHostApplication(dto).subscribe(
        (success) => {
          this.router.navigate(['/host-next-steps']);
        }, (err) => {
          this.state.setLoading(false);
          this.handleError(err);
        }
    );
  }

  public handleError(err) {
    let isDuplicateGatheringAddress: boolean = err.status === 406;

    if (isDuplicateGatheringAddress) {
      this.toast.error('You cannot host another gathering at the same location. ' +
          'Please change the address and try again!', null, {toastLife: 3000});
    } else {
      this.toast.error('An error occurred, please try again later.', null, {toastLife: 3000});
    }
  }

  public closeClick() {
    this.location.back();
  }
}
