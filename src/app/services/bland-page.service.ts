import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BlandPageDetails, BlandPageCause, BlandPageType } from '../models/bland-page-details';
import { StateService } from './state.service';

@Injectable()
export class BlandPageService {

    private blandPageDetails: BlandPageDetails;

    constructor(private router: Router,
                private state: StateService) {}

    public primeAndGo(bpd: BlandPageDetails) {
        this.blandPageDetails = bpd;
        this.go();
    }

    public setPageHeader(title, backLink) {
      this.state.setPageHeader(title, backLink);
    }

    public getBlandPageDetails() {
        let bpd = this.blandPageDetails;
        // clear setup for later use
        this.blandPageDetails = null;
        return bpd;
    }

    public goToDefaultError(goToRoute: string) {
        this.blandPageDetails = new BlandPageDetails(
            'back',
            '<h1 class="title text-lowercase">OOPS</h1><p>Something went wrong.</p>',
            BlandPageType.Text,
            BlandPageCause.Error,
            goToRoute
        );
        this.go();
    }

    public goToGettingStarted(cancelRoute?: string) {
        this.router.navigate(['/getting-started']);
    }

    public goToWhatsAHost(cancelRoute?: string) {
        this.primeWhatsAHost(cancelRoute);
        this.router.navigate(['/whats-a-host']);
    }

    public goToHandledInvite(accepted: boolean, groupId: number) {
        this.primeHandleInvite(accepted, groupId);
        this.router.navigate([accepted ? '/invite-accepted' : '/invite-declined']);
    }

    /**
     * This will set the blandPageDetails for Whats a Host and
     * nothing more.  This should only be used by the Whats A Host route Guard.
     * @param cancelRoute route to return to if (x) is clicked
     */
    public primeWhatsAHost(cancelRoute: string = '') {
        this.blandPageDetails = new BlandPageDetails(
            'Sign up to host',
            'finderWhatsAHost',
            BlandPageType.ContentBlock,
            BlandPageCause.SimpleFauxdal,
            'host-signup',
            cancelRoute
        );
    }

    /**
     * This will set the blandPageDetails for handling an invite and
     * nothing more.
     * @param accepted If the invite is being accepted or declined.
     */
    public primeHandleInvite(accepted: boolean, groupId: number) {
        this.blandPageDetails = new BlandPageDetails(
            accepted === true ? `Check the group out` : 'Go to the map',
            accepted === true ? 'finderInviteAccepted' : 'finderInviteDeclined',
            BlandPageType.ContentBlock,
            BlandPageCause.Success,
            accepted === true ? `gathering/${groupId}` : ''
        );
    }

    public primed() {
        return (this.blandPageDetails !== null && this.blandPageDetails !== undefined);
    }

    private go() {
        if (this.blandPageDetails.blandPageCause === BlandPageCause.Error) {
            this.router.navigate(['error']);
        } else {
            this.router.navigate(['success']);
        }
    }
}
