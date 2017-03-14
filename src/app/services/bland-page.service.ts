import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BlandPageDetails, BlandPageCause } from '../models/bland-page-details';

@Injectable()
export class BlandPageService {

    private blandPageDetails: BlandPageDetails;

    constructor(private router: Router) { }

    public setBlandPageDetailsAndGo(cs: BlandPageDetails) {
        this.blandPageDetails = cs;
        this.go();
    }

    public getBlandPageDetails() {
        let bpd = this.blandPageDetails;
        //clear setup for later use
        this.blandPageDetails = null;
        return bpd;
    }

    private go() {
        if (this.blandPageDetails.blandPageCause == BlandPageCause.Error) {
            this.router.navigate(['error']);
        } else {
            this.router.navigate(['success']);
        }
    }
}