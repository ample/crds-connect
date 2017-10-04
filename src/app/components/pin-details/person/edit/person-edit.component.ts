import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
  } from '@angular/forms';
import { PlatformLocation } from '@angular/common';
import { ToastsManager } from 'ng2-toastr';

import { AddressService } from '../../../../services/address.service';
import { ContentService } from 'crds-ng2-content-block';
import { BlandPageService } from '../../../../services/bland-page.service';
import { PinService } from '../../../../services/pin.service';
import { SessionService } from '../../../../services/session.service';
import { StateService } from '../../../../services/state.service';

import { BlandPageCause, BlandPageDetails, BlandPageType, Pin, pinType } from '../../../../models';
import { ViewType } from '../../../../shared/constants';


@Component({
  selector: 'person-edit',
  templateUrl: './person-edit.component.html'
})
export class PersonEditComponent implements OnInit {
  @Input() pin: Pin;
  @Input() isPinOwner: boolean = true;
  public editPersonForm: FormGroup;
  private submitting: boolean = false;
  private ready: boolean = false;
  private submissionError: boolean = false;

  constructor(private route: ActivatedRoute,
    private session: SessionService,
    private blandPageService: BlandPageService,
    private state: StateService,
    private addressService: AddressService,
    private toastr: ToastsManager,
    private content: ContentService,
    private pinService: PinService,
    private router: Router) { }

  // TODO: Refactor so that when we have pin data we don't go out and get it again. Still need to get it if navigated to directly.
  ngOnInit() {
    this.state.setLoading(true);
    this.pin = this.route.snapshot.data['pin'];
    this.editPersonForm = new FormGroup({});
    this.checkPinOwner(this.pin);
    this.state.setPageHeader('Details', `/person/${this.pin.participantId}`);
    this.addressService.getFullAddress(this.pin.participantId, pinType.PERSON)
      .finally(() => {
        this.ready = true;
        this.state.setLoading(false);
      })
      .subscribe(
      address => {
        this.pin.address = address;
      },
      error => {
        this.content.getContent('errorRetrievingFullAddress').subscribe(message => this.toastr.error(message.content));
      }
      );
  }

  public checkPinOwner(pin) {
    if (pin.contactId !== this.session.getContactId()) {
      const bpd = new BlandPageDetails(
        'Return to map',
        'Sorry you do not own the pin being edited',
        BlandPageType.Text,
        BlandPageCause.Error,
        '',
        ''
      );
      this.blandPageService.primeAndGo(bpd);
    }
  }

  public onSubmit() {
    this.submitting = true;
    this.pinService.postPin(this.pin)
      .finally(() => {
        this.submitting = false;
      })
      .subscribe(
      (pin) => {
        this.addressService.clearCache();
        this.content.getContent('finderPersonSavedSuccess').subscribe(message => this.toastr.success(message.content));
        this.pin = pin;
        this.state.navigatedFromAddToMapComponent = true;
        this.state.postedPin = pin;
        this.state.setLastSearch(null);
        this.router.navigate(['/person', this.pin.participantId]);
      },
      (error) => {
        this.content.getContent('finderPersonSavedError').subscribe(message => this.toastr.error(message.content));
        this.submissionError = true;
        console.log(error);
      }
      );
  }

  public removePersonPin() {
    this.state.setCurrentView(ViewType.MAP);
    this.router.navigate(['/remove-person-pin', this.pin.participantId]);
  }

  public cancel() {
    this.state.setCurrentView(ViewType.LIST);
    this.router.navigate(['/person', this.pin.participantId]);
  }

}
