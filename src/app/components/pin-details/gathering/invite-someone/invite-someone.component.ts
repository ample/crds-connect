import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailAddressValidator } from '../../../../validators/email-address.validator';
import { ToastsManager } from 'ng2-toastr';

import { PinService } from '../../../../services/pin.service';
import { BlandPageService } from '../../../../services/bland-page.service';
import { StateService } from '../../../../services/state.service';

import { Person } from '../../../../models/person';
import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../../../models/bland-page-details';

@Component({
    selector: 'invite-someone',
    templateUrl: './invite-someone.html'
})

export class InviteSomeoneComponent implements OnInit {

    @Input() gatheringId: number;
    @Input() participantId: number;

    public inviteFormGroup: FormGroup;

    constructor(private fb: FormBuilder,
        private router: Router,
        private pinService: PinService,
        private blandPageService: BlandPageService,
        private state: StateService,
        private toast: ToastsManager) { }

    ngOnInit() {
        this.inviteFormGroup = new FormGroup({
            firstname: new FormControl('', [Validators.required]),
            lastname: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, EmailAddressValidator.validateEmail])
        });
    }

    onSubmit({ value, valid }: { value: any, valid: boolean }) {
        if (valid) {
            let someone = new Person(value.firstname, value.lastname, value.email);

            this.state.setLoading(true);
            this.pinService.inviteToGathering(this.gatheringId, someone).subscribe(
                success => {
                    let bpd = new BlandPageDetails(
                        'Return to my pin',
                        '<h1 class="h1 text-center">Invite sent</h1>' +
                        // tslint:disable-next-line:max-line-length
                        `<p class="text text-center">${someone.firstname.slice(0, 1).toUpperCase()}${someone.firstname.slice(1).toLowerCase()} ${someone.lastname.slice(0, 1).toUpperCase()}. has been notified.</p>`,
                        BlandPageType.Text,
                        BlandPageCause.Success,
                        `gathering/${this.gatheringId}`
                    );

                    this.blandPageService.primeAndGo(bpd);
                },
                failure => {
                    this.state.setLoading(false);
                    this.toast.error('Error sending invite', 'Please try again');
                }
            );
        }
    }
}
