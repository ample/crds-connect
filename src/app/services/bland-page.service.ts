import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BlandPageDetails, BlandPageCause, BlandPageType, BlandPageButton } from '../models/bland-page-details';

@Injectable()
export class BlandPageService {

    private blandPageDetails: BlandPageDetails;

    constructor(private router: Router) { }

    public primeAndGo(bpd: BlandPageDetails) {
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
        let succButton = new BlandPageButton(
            'Back',
            null,
            ''
        );

        let buttons = new Array<BlandPageButton>();
        buttons.push(succButton);
        this.blandPageDetails = new BlandPageDetails(
            "<h1 class='h1 text-center'>OOPS</h1><p class='text text-center'>Something went wrong.</p>",
            BlandPageType.Text,
            BlandPageCause.Error,
            '',
            goToRoute,
            buttons
        );
        this.go();
    }

    public goToGettingStarted(cancelRoute?: string) {
        this.primeGettingStarted(cancelRoute);
        this.router.navigate(['/getting-started']);
    }

    public goToWhatsAHost(cancelRoute?: string) {
        this.primeWhatsAHost(cancelRoute);
        this.router.navigate(['/whats-a-host']);
    }

    /**
     * This will set the blandPageDetails for Getting Started and 
     * nothing more.  This should only be used by the Getting Started route Guard.
     * @param cancelRoute route to return to if (x) is clicked
     */
    public primeGettingStarted(cancelRoute: string = 'map') {
        let succButton = new BlandPageButton(
            'Add me to map',
            null,
            ''
        );

        let buttons = new Array<BlandPageButton>();
        buttons.push(succButton);
        this.blandPageDetails = new BlandPageDetails(
            '',
            BlandPageType.ContentBlock,
            BlandPageCause.SimpleFauxdal,
            'add-me-to-the-map',
            cancelRoute,
            buttons
        );
    }
    /**
     * This will set the blandPageDetails for Whats a Host and 
     * nothing more.  This should only be used by the Whats A Host route Guard.
     * @param cancelRoute route to return to if (x) is clicked
     */
    public primeWhatsAHost(cancelRoute: string = 'map') {
        let succButton = new BlandPageButton(
            'Sign up to host',
            null,
            ''
        );

        let buttons = new Array<BlandPageButton>();
        buttons.push(succButton);
        this.blandPageDetails = new BlandPageDetails(
            '',
            BlandPageType.ContentBlock,
            BlandPageCause.SimpleFauxdal,
            "host-signup",
            cancelRoute,
            buttons
        );


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