import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BlandPageDetails, BlandPageCause, BlandPageType } from '../models/bland-page-details';

@Injectable()
export class BlandPageService {

    private blandPageDetails: BlandPageDetails;

    constructor(private router: Router) { }

    public setBlandPageDetailsAndGo(bpd: BlandPageDetails) {
        this.blandPageDetails = bpd;
        this.go();
    }

    public getBlandPageDetails() {
        let bpd = this.blandPageDetails;
        //clear setup for later use
        this.blandPageDetails = null;
        return bpd;
    }

    public goToDefaultError(goToRoute: string) {
        this.blandPageDetails = new BlandPageDetails(
            "back",
            "<h1 class='h1 text-center'>OOPS</h1><p class='text text-center'>Something went wrong.</p>",
            goToRoute,
            BlandPageType.Text,
            BlandPageCause.Error
        );
        this.go();
    }

    public primed() {
        return (this.blandPageDetails !== null && this.blandPageDetails !== undefined);
    }

    private go() {
        if (this.blandPageDetails.blandPageCause == BlandPageCause.Error) {
            this.router.navigate(['error']);
        } else {
            this.router.navigate(['success']);
        }
    }
}