import { BlandPageCause, BlandPageDetails, BlandPageType } from '../../models/bland-page-details';
import { BlandPageService } from '../../services/bland-page.service';
import { GroupService } from '../../services/group.service';
import { ActivatedRoute } from '@angular/router';
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
        private blandPageService: BlandPageService) { }

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
                this.blandPageService.goToHandledInvite(this.accepted, this.groupId);
            },
            error => {
                this.blandPageService.primeAndGo(
                    new BlandPageDetails(
                        'Go to connect',
                        'Sorry, something went wrong.',
                        BlandPageType.Text,
                        BlandPageCause.Error,
                        '')
                );
            }
        );
    }
}
