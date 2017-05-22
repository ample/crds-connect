import { Address } from '../../models/address';
import { pinType } from '../../models/pin';
import { PinIdentifier } from '../../models/pin-identifier';
import { PinService } from '../../services/pin.service';
import { BlandPageComponent } from '../bland-page/bland-page.component';
import { BlandPageCause, BlandPageDetails, BlandPageType } from '../../models/bland-page-details';
import { BlandPageService } from '../../services/bland-page.service';
import { GroupService } from '../../services/group.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { StateService } from '../../services/state.service';

@Component({
    selector: 'handle-invite',
    templateUrl: 'handle-invite.component.html'
})
export class HandleInviteComponent implements OnInit {

    private guid: string;
    private groupId: number;
    private accepted: boolean;

    constructor(
        private state: StateService,
        private route: ActivatedRoute,
        private groupService: GroupService,
        private blandPageService: BlandPageService,
        private pinService: PinService,
        private router: Router) { }

    ngOnInit() {
        this.state.setLoading(true);


        this.guid = this.route.snapshot.params['guid'];
        this.groupId = this.route.snapshot.params['groupId'];
        this.accepted = this.route.snapshot.data[0]['accept'];

        if (!this.guid) {
            this.blandPageService.primeAndGo(
                new BlandPageDetails(
                    'Go to connect',
                    'Sorry, this invitation is not valid.',
                    BlandPageType.Text,
                    BlandPageCause.Error,
                    '')
            );
        } else {
            this.handleInvite();
        }
    }

    public handleInvite() {
        this.groupService.handleInvite(this.guid, this.accepted, this.groupId).subscribe(
            response => {
                this.pinService.getPinDetails(new PinIdentifier(pinType.GATHERING, this.groupId)).subscribe(
                    success => {
                        let address = success.address;
                        let name = success.firstName + ' ' + success.lastName.slice(0, 1);
                        this.blandPageService.goToHandledInvite(this.accepted, this.groupId, address, name);
                    },
                    error => {
                        this.router.navigate(['']);
                    }
                );
            },
            error => {
                let errorText: string;

                // already in group
                if (error.status === 409) {
                    errorText = 'Looks like you are already in this gathering.';
                    // bad or unusable guid
                } else {
                    errorText = 'Oops, looks like there was a problem. Please try again.';
                }

                this.blandPageService.primeAndGo(
                    new BlandPageDetails(
                        'Go to map',
                        errorText,
                        BlandPageType.Text,
                        BlandPageCause.Error,
                        ''
                    )
                );
            }
        );
    }
}
