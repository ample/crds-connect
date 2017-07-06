import { Location } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { BlandPageService } from '../../../../services/bland-page.service';
import { ParticipantService } from '../../../../services/participant.service';
import { StateService } from '../../../../services/state.service';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';

@Component({
    selector: 'participant-remove',
    templateUrl: './participant-remove.component.html'
})
export class ParticipantRemoveComponent implements OnInit, AfterViewInit {
    private groupParticipantId: number;
    private groupId: number;
    private message: string = '';
    private removeParticipantForm: FormGroup;
    private redirectUrl: string;
    private submitting: boolean = false;
    private isFormSubmitted: boolean = false;

    constructor(private participantService: ParticipantService,
        private route: ActivatedRoute,
        private state: StateService,
        private locationService: Location,
        private router: Router,
        private contentService: ContentService,
        private toast: ToastsManager,
        private blandPageService: BlandPageService) { }

    ngOnInit() {
        this.state.setLoading(true);
        this.removeParticipantForm = new FormGroup({
            removalMessage: new FormControl(this.message, [Validators.required]),
        });
        this.route.params.subscribe(params => {
            this.groupId = +params.groupId;
            this.groupParticipantId = +params.groupParticipantId;
            this.participantService.getGroupParticipant(this.groupId, this.groupParticipantId).finally(() => {
                this.state.setLoading(false);
            })
                .subscribe(p => { }, error => {
                    console.log(error);
                    this.handleError();
                });
            this.redirectUrl = `/${this.router.url.split('/')[1]}/${this.groupId}`;
        }, error => {
            this.handleError();
        });
    }

    public ngAfterViewInit() {
        // This component is rendered within a fauxdal,
        // so we need the following selector added to <body> element
        document.querySelector('body').classList.add('fauxdal-open');
    }

    public closeClick() {
        this.locationService.back();
    }

    public onSubmit({ valid }: { valid: boolean }) {
        this.isFormSubmitted = true;
        if (valid) {
            this.submitting = true;
            this.participantService.removeParticipant(this.groupId, this.groupParticipantId, this.message)
                .finally(() => {
                    this.submitting = false;
                })
                .subscribe(done => {
                    this.router.navigate([this.redirectUrl]);
                }, error => {
                    console.log(error);
                    this.toast.error(this.contentService.getContent('groupToolRemoveParticipantFailure'));
                });
        }
    }

    private handleError() {
        this.blandPageService.goToDefaultError(this.redirectUrl);
    }
}