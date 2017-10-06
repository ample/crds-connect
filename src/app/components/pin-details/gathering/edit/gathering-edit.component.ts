import { PlatformLocation } from '@angular/common';
import { PinService } from '../../../../services/pin.service';
import { ToastsManager } from 'ng2-toastr';
import { AddressService } from '../../../../services/address.service';
import { StateService } from '../../../../services/state.service';
import { BlandPageDetails, BlandPageType, BlandPageCause, Pin, pinType } from '../../../../models';
import { BlandPageService } from '../../../../services/bland-page.service';
import { SessionService } from '../../../../services/session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ContentService } from 'crds-ng2-content-block';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'gathering-edit',
  templateUrl: './gathering-edit.component.html'
})
export class GatheringEditComponent implements OnInit {
  @Input() pin: Pin;

  public editGatheringForm: FormGroup;
  public pinType: any = pinType;
  public submitting: boolean = false;
  public ready: boolean = false;
  public submissionError: boolean = false;

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

    this.editGatheringForm = new FormGroup({
      description: new FormControl(this.pin.gathering.groupDescription, [Validators.required]),
      updateHomeAddress: new FormControl(this.pin.updateHomeAddress)
    });
    this.checkPinOwner(this.pin);
    this.state.setPageHeader('gathering', `/gathering/${this.pin.gathering.groupId}`);
    Observable.forkJoin(
      this.addressService.getFullAddress(this.pin.gathering.groupId, pinType.GATHERING),
      this.addressService.getFullAddress(this.pin.participantId, pinType.PERSON))
      .finally(() => {
        this.ready = true;
        this.state.setLoading(false);
      })
      .subscribe(
      addresses => {
        this.pin.gathering.address = addresses[0];
        this.pin.address = addresses[1];
        this.pin.updateHomeAddress = this.doPinAndGatheringHaveSameAddress(this.pin);
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

  public doPinAndGatheringHaveSameAddress(pin: Pin): boolean {
    return (pin.address.addressLine1 === pin.gathering.address.addressLine1
      && pin.address.addressLine2 === pin.gathering.address.addressLine2
      && pin.address.city === pin.gathering.address.city
      && pin.address.state === pin.gathering.address.state);
  }

  public onSubmit() {
    this.submitting = true;
    this.pinService.updateGathering(this.pin)
      .finally(() => {
        this.submitting = false;
      })
      .subscribe(
      (pin) => {
        this.addressService.clearCache();
        this.content.getContent('finderGatheringSavedSuccessfully').subscribe(message => this.toastr.success(message.content));
        this.pin = pin;
        this.state.navigatedFromAddToMapComponent = true;
        this.state.postedPin = pin;
        this.pinService.setEditedGatheringPin(pin);
        this.state.setLastSearch(null);
        this.router.navigate(['/gathering', this.pin.gathering.groupId]);
      },
      (error) => {
        this.content.getContent('finderGatheringSavedError').subscribe(message => this.toastr.error(message.content));
        this.submissionError = true;
        console.log(error);
      }
      );
  }

  public cancel() {
    this.router.navigate(['/gathering', this.pin.gathering.groupId]);
  }

}
