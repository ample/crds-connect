import { StateService } from '../../services/state.service';
import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'stuff-not-found',
    templateUrl: 'stuff-not-found.html'
})
export class StuffNotFoundComponent implements OnInit {


    constructor(private state: StateService) { }

    public ngOnInit() {
        this.state.setPageHeader('my stuff', '/');
        this.state.setLoading(false);
        this.state.myStuffActive = false;
    }

}
