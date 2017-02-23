import { Injectable, NgZone } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { SessionService } from './session.service';
import { PinService } from './pin.service';

import { IFrameParentService } from './iframe-parent.service';
import { LookupTable } from '../models/lookup-table';
import { Pin } from '../models/pin';
import { User } from '../models/user';
import { UserDataForPinCreation } from '../models/user-data-for-pin-creation';
import { Address } from '../models/address';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class APIService {

  private baseUrl = process.env.CRDS_API_ENDPOINT;

  public restVerbs = {
    post: 'POST',
    put: 'PUT'
  };

  public defaults = {
    authorized: null
  };

  constructor( private http: Http,
               private session: SessionService,
               private pin: PinService) { }

  public getAuthentication(): Observable<any> {
    return this.session.get(this.baseUrl + 'api/v1.0.0/authenticated')
      .map((res: Response) => {
        return res || this.defaults.authorized;
      })
      .catch((res: Response) => {
        return [this.defaults.authorized];
      });
  }

  public getClientIpFromThirdPartyApi(): Observable<any> {

    let obs: Observable<any> = new Observable(observer => {
      this.http.get('https://api.ipify.org/?format=json').map(this.extractData).subscribe(
        ip => observer.next(ip),
        err => observer.error(new Error('Could not fetch client IP'))
      );
    });

    return obs;
  }

  public getLocationFromIP(): Observable<any> {

    let obs: Observable<any> = new Observable(observer => {
      this.getClientIpFromThirdPartyApi().subscribe(
        ipData => {
          let corsFriendlyIp = ipData.ip.toString().split('.').join('-');
          let geoLocByIpUrl = this.baseUrl + 'api/v1.0.0/finder/pinbyip/' + corsFriendlyIp;
          this.session.get(geoLocByIpUrl)
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe(
              geoLocationData => observer.next(geoLocationData),
              err => observer.error(new Error('Failed to get geolocation from API via IP'))
            );
        }, error => {
          observer.error(new Error('Failed to get geolocation from API via IP'));
        }
      )
    });

    return obs;
  }

  public getRegisteredUser(email: string): Observable<boolean> {
    return this.http.get(this.baseUrl + 'api/lookup/0/find/?email=' + encodeURIComponent(email))
      .map(res => { return false; })
      .catch(res => { return [true]; });
  };

  public getStateList(): Observable<any> {
    return this.session.get(this.baseUrl + 'api/lookup/states')
        .map((res: Array<LookupTable>) => {
          return res;
        })
        .catch( (err) => Observable.throw(err.json().error) );
  }

  public getUserData(): Observable<any> {
    return this.session.get(`${this.baseUrl}api/finder/pin/contact/${this.session.getContactId()}/false`)
        .map((res: Pin) => {
          let userAddress = new Address(res.address.addressId, res.address.addressLine1, res.address.addressLine2,
            res.address.city, res.address.state, res.address.zip, res.address.longitude, res.address.latitude);
          let userData: UserDataForPinCreation = new UserDataForPinCreation(res.contactId, res.householdId,
              res.firstname, res.lastname, res.emailAddress, userAddress);

          return userData;
        })
        .catch( (err) => Observable.throw(err.json().error) );
  }

  public postLogin(email: string, password: string): Observable<any> {
    let body = {
      'username': email,
      'password': password
    };
    return this.session.post(this.baseUrl + 'api/login', body)
      .map((res: Response) => {
        return res || this.defaults.authorized;
      })
      .catch(this.handleError);
  }

  postPin(pin: Pin) {

    let postPinUrl = this.baseUrl + 'api/finder/pin';

    return this.session.post(postPinUrl, pin)
        .map((res: any) => {
          return res;
        })
        .catch( (err) => Observable.throw(err.json().error) );
  }

  public postUser(user: User): Observable<any> {
    return this.session.post(this.baseUrl + 'api/user', user)
      .map(this.extractData)
      .catch(this.handleError);
  };

  private extractData(res: Response) {
    let body: any = res;
    if (typeof res.json === 'function') {
      body = res.json();
    }
    return body;
  };

  private handleError(err: Response | any) {
    return Observable.throw(err);
  };

  public isLoggedIn(): boolean {
    return this.session.hasToken();
  }

  public logOut(): void {
    this.session.clearTokens();
    return;
  }

}
