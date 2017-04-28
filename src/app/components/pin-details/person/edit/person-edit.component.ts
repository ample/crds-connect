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
    selector: 'person-edit',
    templateUrl: './person-edit.component.html'
})
export class PersonEditComponent implements OnInit {
    @Input() pin: Pin;
    @Input() isPinOwner: boolean = true;
    private submitting: boolean = false;
    private ready: boolean = false;
    private submissionError: boolean = false;
    public editPersonForm: FormGroup;

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
        this.editPersonForm = new FormGroup({});
        this.checkPinOwner(this.pin);
        this.state.setPageHeader('Details', ['/person', this.pin.participantId]);
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
        this.pinService.postPin(this.pin)
        .finally(() => {
            this.submitting = false;
        })
        .subscribe(
            (pin) => {
                this.addressService.clearCache();
                this.toastr.success(this.content.getContent('personSavedSuccess'));
                this.pin = pin;
                this.router.navigate(['/person', this.pin.participantId]);
            },
            (error) => {
                this.toastr.error(this.content.getContent('personSavedError'));
                this.submissionError = true;
                console.log(error);
            }
        );
    }

    public cancel() {
        this.router.navigate(['/person', this.pin.participantId]);
    }

}
