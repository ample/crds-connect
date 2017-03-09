import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'confirmation',
    templateUrl: 'confirmation.html'
})
export class ConfirmationComponent implements OnInit {

    /** Required.  Text for the action button. */
    @Input() buttonText: string = '';
    /** Required.  Name of the CMS content block to display. */
    @Input() contentBlockName: string = '';
    /** Optional.  Pass a function to override default functionality. */
    @Input() closeFunction: Function;
    /** Optional.  Required if not passing a closeFunction. */
    @Input() goToState: string = '';


    constructor( private router: Router) { }

    ngOnInit() {
    }

    close() {
        if (this.closeFunction !== null && this.closeFunction !== undefined) {
            this.closeFunction();
        } else {
            this.router.navigate(['/' + this.goToState]);
        }
    }
}