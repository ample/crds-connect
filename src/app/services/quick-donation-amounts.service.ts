import { Injectable } from '@angular/core';
import { Http, Response, JsonpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Component, NgZone} from '@angular/core';
import { Injectable }             from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';

import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class QuickDonationAmountsService {

    constructor (private http: Http) {}

    private baseUrl = 'http://localhost:49380/';

    private getQuickAmtsUrl = this.baseUrl + 'api/donations/predefinedamounts';

    private result: any;

    getQuickDonationAmounts (): Observable<number[]> {
        return this.http.get(this.getQuickAmtsUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        console.log('Got response:' );
        console.log(res);
        let body = res.json();
        console.log(body);
        return body || { };
    }
    private handleError (error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    // getQuickDonationAmounts(): number[] {
    //     return [1,2,3,4,5];
    // }
}