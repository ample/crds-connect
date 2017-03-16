import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { BlandPageService } from '../../services/bland-page.service';
import { StateService } from '../../services/state.service';

import { BlandPageDetails, BlandPageType } from '../../models/bland-page-details';

@Component({
    selector: 'bland-page',
    templateUrl: 'bland-page.html'
})
export class BlandPageComponent implements OnInit {

    private blandPageDetails: BlandPageDetails;
    public contentBlock = false;

    constructor(private router: Router,
        private content: ContentService,
        private blandPageService: BlandPageService,
        private state: StateService) {
    }

    ngOnInit() {
        this.blandPageDetails = this.blandPageService.getBlandPageDetails();
        if (this.blandPageDetails.blandPageType == BlandPageType.ContentBlock){
            this.contentBlock = true;
        } else {
            this.contentBlock = false;
        }
        this.state.setLoading(false);
    }

    close() {
        this.router.navigate(['/' + this.blandPageDetails.goToState]);
    }
}