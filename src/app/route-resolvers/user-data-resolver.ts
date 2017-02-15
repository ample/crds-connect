import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class UserDataResolver implements Resolve<any> {

    constructor(private http: Http) { }

    resolve(): Observable<any> {
        let testUrl = 'http://httpbin.org/post';
        let testData = 'The sky is blue';

        return this.http.post(testUrl, testData)
            .map( (res) => res.json() )
            .catch( (err) => Observable.throw(err.json().error) );
    }
}