import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BlandPageService } from '../../services/bland-page.service';
import { StateService } from '../../services/state.service';

import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../models/bland-page-details';

@Component({
    selector: 'bland-page',
    templateUrl: 'bland-page.html'
})
export class BlandPageComponent implements OnInit {

    private blandPageDetails: BlandPageDetails;
    private isFauxModal: boolean = false;
    public contentBlock = false;

    constructor(private router: Router,
        private blandPageService: BlandPageService,
        private state: StateService) {}

    ngOnInit() {
        this.blandPageDetails = this.blandPageService.getBlandPageDetails();
        this.isFauxModal = this.blandPageDetails.blandPageCause === BlandPageCause.SimpleFauxdal;
        if (this.blandPageDetails.blandPageType === BlandPageType.ContentBlock) {
            this.contentBlock = true;
        } else {
            this.contentBlock = false;
        }
        this.state.setLoading(false);
    }

    close() {
        let state = this.blandPageDetails.cancelState != null ? this.blandPageDetails.cancelState : this.blandPageDetails.goToState;
        this.router.navigate(['/' + state]);
    }

    go() {
        this.router.navigate(['/' + this.blandPageDetails.goToState]);
    }
}
