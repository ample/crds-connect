import { PlatformLocation } from '@angular/common';
import { PinService } from '../../../../services/pin.service';
import { ToastsManager } from 'ng2-toastr';
import { AddressService } from '../../../../services/address.service';
import { StateService } from '../../../../services/state.service';
import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../../../models/bland-page-details';
import { BlandPageService } from '../../../../services/bland-page.service';
import { SessionService } from '../../../../services/session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Pin, pinType } from '../../../../models/pin';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';

@Component({
    selector: 'gathering-edit',
    templateUrl: './gathering-edit.component.html'
})
export class GatheringEditComponent implements OnInit {
    @Input() pin: Pin;
    private submitting: boolean = false;
    private ready: boolean = false;
    private submissionError: boolean = false;
    public editGatheringForm: FormGroup;

    constructor(private route: ActivatedRoute,
                private session: SessionService,
                private blandPageService: BlandPageService,
                private state: StateService,
                private addressService: AddressService,
                private toastr: ToastsManager,
                private content: ContentService,
                private pinService: PinService,
                private router: Router) { }

    ngOnInit() {
        this.state.setLoading(true);
        this.pin = this.route.snapshot.data['pin'];
        this.editGatheringForm = new FormGroup({
            description: new FormControl(this.pin.gathering.groupDescription, [Validators.required])
        });
        this.checkPinOwner(this.pin);
        this.state.setPageHeader('gathering', ['/gathering', this.pin.gathering.groupId]);
        this.addressService.getFullAddress(this.pin.gathering.groupId, pinType.GATHERING)
            .finally(() => {
              this.ready = true;
              this.state.setLoading(false);
            })
            .subscribe(
            address => {
              this.pin.gathering.address = address;
            },
            error => {
              this.toastr.error(this.content.getContent('errorRetrievingFullAddress'));
            }
            );
    }

    public checkPinOwner(pin) {
        if (pin.contactId !== this.session.getContactId()) {
            let bpd = new BlandPageDetails(
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
        this.pinService.updateGathering(this.pin)
        .finally(() => {
            this.submitting = false;
        })
        .subscribe(
            (pin) => {
                this.addressService.clearCache();
                this.toastr.success(this.content.getContent('gatheringSavedSuccessfully'));
                this.pin = pin;
                this.router.navigate(['/gathering', this.pin.gathering.groupId]);
            },
            (error) => {
                this.toastr.error(this.content.getContent('gatheringSavedError'));
                this.submissionError = true;
                console.log(error);
            }
        );
    }

}
