import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BlandPageService } from '../../services/bland-page.service';
import { StateService } from '../../services/state.service';

import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../models/bland-page-details';

@Component({
    selector: 'app-bland-page',
    templateUrl: 'bland-page.html'
})
export class BlandPageComponent implements OnInit, AfterViewInit {

    private blandPageDetails: BlandPageDetails;
    private isFauxModal: boolean = false;
    public contentBlock = false;

    constructor(private route: ActivatedRoute,
        private router: Router,
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

    ngAfterViewInit() {
        let data = this.route.snapshot.data;

        let isFauxdal: boolean = (data[0] !== undefined && data[0]['isFauxdal']) || this.isFauxModal;

        if (isFauxdal) {
            // This component is rendered within a fauxdal, so we to need the .fauxdal-open
            //  selector to the <body> element when this view is initialized.
            document.querySelector('body').classList.add('fauxdal-open');
        }
    }

    close() {
        if (this.blandPageDetails.cancelState === 'useDefaultBrowserBackFunctionality' ) {
            window.history.go(-1);
        } else {
            let state = this.blandPageDetails.cancelState != null ? this.blandPageDetails.cancelState : this.blandPageDetails.goToState;
            this.router.navigate(['/' + state]);
        }
    }

    go() {
        this.router.navigate(['/' + this.blandPageDetails.goToState]);
    }
}
