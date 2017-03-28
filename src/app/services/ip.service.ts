import { Injectable, NgZone } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { SessionService } from './session.service';
import { PinService } from './pin.service';

import { IFrameParentService } from './iframe-parent.service';
import { LookupTable } from '../models/lookup-table';
import { Pin } from '../models/pin';
import { PinSearchResultsDto } from '../models/pin-search-results-dto';
import { User } from '../models/user';
import { UserDataForPinCreation } from '../models/user-data-for-pin-creation';
import { Address } from '../models/address';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class IPService {

  private baseUrl = process.env.CRDS_API_ENDPOINT;

  public restVerbs = {
    post: 'POST',
    put: 'PUT'
  };

  public defaults = {
    authorized: null
  };

  constructor(private http: Http,
    private session: SessionService,
    private pin: PinService) { }

  //GETS
  public getClientIpFromThirdPartyApi(): Observable<any> {
    let obs: Observable<any> = new Observable(observer => {
      this.http.get('https://api.ipify.org/?format=json').map(this.session.extractData).subscribe(
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
            .map(this.session.extractData)
            .catch(this.session.handleError)
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
}
