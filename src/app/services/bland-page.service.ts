import { Address } from '../models/address';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BlandPageDetails, BlandPageCause, BlandPageType } from '../models/bland-page-details';
import { StateService } from './state.service';

@Injectable()
export class BlandPageService {
    private blandPageDetails: BlandPageDetails;

    constructor(private router: Router,
        private state: StateService) { }

    public primeAndGo(bpd: BlandPageDetails) {
        this.blandPageDetails = bpd;
        this.go();
    }

    public setPageHeader(title: string, backLink: string) {
        this.state.setPageHeader(title, backLink);
    }

    public getBlandPageDetails() {
        const bpd = this.blandPageDetails;
        // clear setup for later use
        this.blandPageDetails = null;
        return bpd;
    }

    public goToDefaultError(goToRoute: string) {
        this.blandPageDetails = new BlandPageDetails(
            'back',
            '<h1 class="title">OOPS</h1><p>Something went wrong.</p>',
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

    public goToHandledInvite(accepted: boolean, groupId: number, address: Address, name: string) {
        this.primeHandleInvite(accepted, groupId, address, name);
        this.router.navigate([accepted ? '/invite-accepted' : '/invite-declined']);
    }

    public goToHostNextSteps(cancelRoute?: string) {
        this.primeWhatsAHost(cancelRoute);
        this.router.navigate(['/host-next-steps']);
    }

    public goToRemovePersonPin(cancelRoute?: string) {
        this.primeRemovePersonPin(cancelRoute);
        this.router.navigate(['/remove-person-pin']);

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
            `getting-started`
        );
    }

    /**
     * This will set the blandPageDetails for handling an invite and
     * nothing more.
     * @param accepted If the invite is being accepted or declined.
     */
    public primeHandleInvite(accepted: boolean, groupId: number, address: Address, name: string) {
        let text: string;

        if (accepted) {
            text = '<strong>Nice.</strong><br /><br />' +
                   `You've accepted an invitation to attend ${name}'s gathering ` +
                   `in ${address.city}, ${address.state}.`;
        } else {
            text = '<strong>Invitation declined</strong><br /><br />' +
                   `You declined an invitation to attend ${name}'s gathering ` +
                   `in ${address.city}, ${address.state}.`;
        }

        this.blandPageDetails = new BlandPageDetails(
            accepted === true ? `Check out the group` : 'Go to the map',
            text,
            BlandPageType.Text,
            BlandPageCause.Success,
            accepted === true ? `gathering/${groupId}` : ''
        );
    }

    public primeHostNextSteps(cancelRoute: string = '') {
        this.blandPageDetails = new BlandPageDetails(
            'Got it',
            'finderHostNextSteps',
            BlandPageType.ContentBlock,
            BlandPageCause.SimpleFauxdal,
            '/',
            cancelRoute
        );
    }

    public primeRemovePersonPin(cancelRoute: string = '') {
        this.blandPageDetails = new BlandPageDetails(
            'Remove my pin',
            '',
            BlandPageType.Text,
            BlandPageCause.SimpleFauxdal,
            '/',
            cancelRoute
        );
    }

    public navigateToMessageSentToLeaderConfirmation(): void {
      const blandPageDetails = new BlandPageDetails(
          'Return to results',
          'messageSentToGroupLeaderConfirmation',
          BlandPageType.ContentBlock,
          BlandPageCause.SimpleFauxdal,
          '/',
          '/');
      this.primeAndGo(blandPageDetails);
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
