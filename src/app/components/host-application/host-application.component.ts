import { Component, OnInit, AfterViewInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastsManager } from 'ng2-toastr';
import { ContentService } from 'crds-ng2-content-block';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { StripTagsPipe } from '../../pipes/strip-tags.pipe';

import { Address } from '../../models/address';
import { HostRequestDto } from '../../models/host-request-dto';
import { HostApplicatonForm } from '../../models/host-application-form';
import { DetailedUserData } from '../../models/detailed-user-data';

@Component({
  selector: 'app-host-application',
  templateUrl: 'host-application.component.html'
})
export class HostApplicationComponent implements OnInit, AfterViewInit, OnDestroy {
  public userData: DetailedUserData;
  public hostForm: FormGroup;
  public homeAddress: Address;
  public groupAddress: Address;
  public groupNameForGatheringAddress: string = 'groupAddress';
  public isFormSubmitted: boolean = false;
  public errorMessage: string = '';
  public mask = [/[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public isHidden = true; // temporary fix for hiding isHomeAddress checkbox

  constructor(
    private content: ContentService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private session: SessionService,
    private state: StateService,
    private toast: ToastsManager,
    private stripHtmlPipe: StripTagsPipe
  ) { }

  public ngOnInit() {
    this.userData = this.route.snapshot.data['userData'];
    const mobilePhone: string = this.userData.mobilePhone;
    this.homeAddress = this.userData.address;
    this.groupAddress = new Address(null, '', '', '', '', '', null, null, null, null);
    let gatheringDescriptionPlaceholder;
    this.content.getContent('defaultGatheringDesc').subscribe(message => {
      gatheringDescriptionPlaceholder = this.stripHtmlPipe.transform(message.content);
    });

    this.hostForm = new FormGroup({
      isHomeAddress: new FormControl(true, [Validators.required]),
      contactNumber: new FormControl(mobilePhone, [Validators.required, Validators.minLength(12), Validators.maxLength(12)]),
      gatheringDescription: new FormControl(gatheringDescriptionPlaceholder, [Validators.required, Validators.maxLength(500)])
    });

    this.state.setLoading(false);
  }

  public ngAfterViewInit() {
    // This component is rendered within a fauxdal,
    // so we need the following selector added to <body> element
    document.querySelector('body').classList.add('fauxdal-open');
  }

  ngOnDestroy() {
    document.querySelector('body').classList.remove('fauxdal-open');
  }

  public onIsHomeAddressClicked() {
    if (!this.hostForm.value.isHomeAddress) {
      this.hostForm.removeControl(this.groupNameForGatheringAddress);
    }
  }

  public onSubmit({ value, valid }: { value: HostApplicatonForm; valid: boolean }) {
    this.isFormSubmitted = true;
    if (valid) {
      this.state.setLoading(true);
      this.submitFormToApi(value);
    }
  }

  public submitFormToApi(formData: HostApplicatonForm) {
    const dto: HostRequestDto = this.convertFormToDto(formData, this.userData.contactId);

    this.session.postHostApplication(dto).subscribe(
      success => {
        this.router.navigate(['/host-next-steps']);
      },
      err => {
        this.state.setLoading(false);
        this.handleError(err);
      }
    );
  }

  public handleError(err) {
    const isDuplicateGatheringAddress: boolean = err.status === 406;
    // TODO: Content blocks?
    if (isDuplicateGatheringAddress) {
      this.toast.error(
        'You cannot host another gathering at the same location. ' + 'Please change the address and try again!'
      );
    } else {
      this.toast.error('An error occurred, please try again later.');
    }
  }

  public closeClick() {
    this.location.back();
  }

  private convertFormToDto(hostForm: HostApplicatonForm, contactId: number): HostRequestDto {
    const dto: HostRequestDto = new HostRequestDto(
      contactId,
      hostForm.isHomeAddress ? hostForm.homeAddress : hostForm.groupAddress,
      hostForm.isHomeAddress,
      hostForm.contactNumber,
      hostForm.gatheringDescription
    );
    return dto;
  };
}
