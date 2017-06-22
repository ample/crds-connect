import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailAddressValidator } from '../../../../validators/email-address.validator';
import { ToastsManager } from 'ng2-toastr';
import { ModalModule } from 'ngx-bootstrap';

import { AppSettingsService } from '../../../../services/app-settings.service';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { PinService } from '../../../../services/pin.service';
import { BlandPageService } from '../../../../services/bland-page.service';
import { ParticipantService } from '../../../../services/participant.service';
import { StateService } from '../../../../services/state.service';

import { Person } from '../../../../models/person';
import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../../../models/bland-page-details';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'add-someone',
    templateUrl: './add-someone.html'
})

export class AddSomeoneComponent implements OnInit {
    @ViewChild('resultsModal') public resultsModal: ModalDirective;
    @Input() gatheringId: number;
    @Input() participantId: number;

    public addFormGroup: FormGroup;
    public isFormSubmitted: boolean = false;
    public matches: Person[];
    public selectedMatch: Person = new Person();
    public matchFound: boolean = false;
    public useSelectedButtonDisabled: boolean = true;

    constructor(private pinService: PinService,
                private blandPageService: BlandPageService,
                private state: StateService,
                private toast: ToastsManager,
                private content: ContentService,
                private appSettings: AppSettingsService,
                private participantService: ParticipantService) { }

    ngOnInit() {
        this.addFormGroup = new FormGroup({
            firstname: new FormControl('', [Validators.required]),
            lastname: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, EmailAddressValidator.validateEmail])
        });
    }

    public showResultsModal(): void {
        this.resultsModal.show();
    }

    public hideResultsModal(): void {
        this.resultsModal.hide();
    }

    public modalUseSelected(): void {
        this.selectedMatch = this.matches[0];
        this.resultsModal.hide();
        this.state.setLoading(true);
        this.addToGroup(this.selectedMatch);
    }

    public modalUseEntered(): void {
        this.selectedMatch = new Person(this.addFormGroup.controls['firstname'].value, this.addFormGroup.controls['lastname'].value, this.addFormGroup.controls['email'].value);
        this.resultsModal.hide();
        this.state.setLoading(true);
        this.addToGroup(this.selectedMatch);
    }

    onSubmit({ value, valid }: { value: any, valid: boolean }) {
        this.isFormSubmitted = true;
        this.matchFound = false;
        if (valid) {
            let someone = new Person(value.firstname, value.lastname, value.email);
            this.selectedMatch = someone;
            this.state.setLoading(true);
            // get matches
            this.pinService.getMatch(someone).subscribe(
                success => {
                    // display the modal so the user can choose 
                    this.state.setLoading(false);
                    success.length > 0 ? this.matchFound = true : this.matchFound = false;
                    this.matches = success;
                    this.selectedMatch = this.matches[0];
                    this.showResultsModal();
                },
                failure => {
                    this.state.setLoading(false);
                    this.toast.error(this.content.getContent('finderErrorInvite'));
                }
            );
        }
    }

    addToGroup(someone: Person) {
        // add someone to the group
        this.pinService.addToGroup(this.gatheringId, someone).subscribe(
            success => {
                this.participantService.clearGroupFromCache(this.gatheringId);
                let bpd = new BlandPageDetails(
                    'Return to my group',
                    '<h1 class="title">Your group is growing!</h1>' +
                    // tslint:disable-next-line:max-line-length
                    `<p>${someone.firstname.slice(0, 1).toUpperCase()}${someone.firstname.slice(1).toLowerCase()} ${someone.lastname.slice(0, 1).toUpperCase()}. has been added to your group.</p>`,
                    BlandPageType.Text,
                    BlandPageCause.Success,
                    `gathering/${this.gatheringId}`
                );

                this.blandPageService.primeAndGo(bpd);
            },
            failure => {
                this.state.setLoading(false);
                this.toast.warning('This user is already in your group.');
            }
        );
    }
}
