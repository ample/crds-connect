import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { ConfirmationSetupService } from '../../services/confirmation-setup.service';

import { ConfirmationSetup } from '../../models/confirmation-setup';

@Component({
    selector: 'confirmation',
    templateUrl: 'confirmation.html'
})
export class ConfirmationComponent implements OnInit {

    private confirmationSetup: ConfirmationSetup;

    constructor(private router: Router,
        private content: ContentService,
        private confirmationSetupService: ConfirmationSetupService) {
    }

    ngOnInit() {
        this.confirmationSetup = this.confirmationSetupService.getConfirmationSetup();
    }

    close() {
        this.router.navigate(['/' + this.confirmationSetup.goToState]);
    }
}