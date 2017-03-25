import { Injectable, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { SmartCacheableService, CacheLevel } from './base-service/cacheable.service';


import { SessionService } from './session.service';
import { sayHiTemplateId } from '../shared/constants';
import { StateService } from '../services/state.service';
import { BlandPageService } from '../services/bland-page.service';
import { IFrameParentService } from './iframe-parent.service';


import { Pin, pinType } from '../models/pin';
import { PinIdentifier } from '../models/pin-identifier';
import { User } from '../models/user';
import { Person } from '../models/person';
import { PinSearchResultsDto } from '../models/pin-search-results-dto';
import { GeoCoordinates } from '../models/geo-coordinates';
import { BlandPageDetails, BlandPageCause, BlandPageType } from '../models/bland-page-details';
import { SearchOptions } from '../models/search-options';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class PinService extends SmartCacheableService<PinSearchResultsDto, SearchOptions> {


  private baseUrl = process.env.CRDS_API_ENDPOINT;
  private baseServicesUrl = process.env.CRDS_API_SERVICES_ENDPOINT;

  public SayHiTemplateId: number;
  public restVerbs = { post: 'POST', put: 'PUT' };
  public defaults = { authorized: null };

  constructor(
    private session: SessionService,
    private state: StateService,
    private blandPageService: BlandPageService,
    private http: Http
  ) {
    super();
    this.SayHiTemplateId = sayHiTemplateId;
  }

  private createPartialCache(pin: Pin): void {
    let pinArray = new Array<Pin>();
    pinArray.push(pin)
    super.setSmartCache(new PinSearchResultsDto(new GeoCoordinates(0, 0), pinArray), CacheLevel.Partial, null);
  }

  //GETS
  public getPinDetails(pinIdentifier: PinIdentifier): Observable<Pin> {
    let cachedPins: PinSearchResultsDto;
    let pin: Pin;
    let url: string;

    if (super.isAtLeastPartialCache()) {
      cachedPins = super.getCache();
      pin = cachedPins.pinSearchResults.find(pin => {
        if (pin.pinType == pinIdentifier.type) {
          if (pinIdentifier.type == pinType.PERSON) {
            return (pin.participantId == pinIdentifier.id);
          } else {
            return (pin.gathering) && (pin.gathering.groupId == pinIdentifier.id);
          }
        } else {
          return false;
        }
      });
      if (pin != null) {

        console.log("PinService got partial cached PinSearchResultsDto");
        return Observable.of<Pin>(pin);
      }
    }
    url = pinIdentifier.type == pinType.PERSON ?
      `${this.baseUrl}api/v1.0.0/finder/pin/${pinIdentifier.id}` :
      `${this.baseUrl}api/v1.0.0/finder/pinByGroupID/${pinIdentifier.id}`;

    console.log("PinService got partial new PinSearchResultsDto");

    return this.session.get(url)
      .do((res: Pin) => this.createPartialCache(res))
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getPinsAddressSearchResults(userSearchAddress: string, lat?: number, lng?: number)
    : Observable<PinSearchResultsDto> {

    let searchOptions = new SearchOptions(userSearchAddress, lat, lng);

    //if we have a cache AND that cache came from a full search and 
    //not just an insert from visiting a detail page off the bat, use that cache
    if (super.cacheIsReadyAndValid(searchOptions, CacheLevel.Full)) {
      
      console.log("PinService got full cached PinSearchResultsDto");
      return Observable.of(super.getCache());
    } else {
      let searchUrl: string = lat && lng ?
        'api/v1.0.0/finder/findpinsbyaddress/' + userSearchAddress
        + '/' + lat.toString().split('.').join('$') + '/'
        + lng.toString().split('.').join('$') :
        'api/v1.0.0/finder/findpinsbyaddress/' + userSearchAddress;

        
      console.log("PinService got full new PinSearchResultsDto");
      return this.session.get(this.baseUrl + searchUrl)
        //when we get the new results, set them to the cache
        .do((res: PinSearchResultsDto) => super.setSmartCache(res, CacheLevel.Full, searchOptions))
        .catch((error: any) => Observable.throw(error || 'Server error'));
    }

  }

  //POSTS
  public sendHiEmail(user: User, pin: Pin): Observable<any> {
    // Create merge data for this template
    let emailInfo = {
      'fromEmailAddress': user.email,
      'toEmailAddress': pin.emailAddress,
      'subject': 'Hi',
      'body': 'Just wanted to say hi',
      'mergeData': this.createTemplateDictionary(user, pin),
      'templateId': this.SayHiTemplateId
    };

    this.state.setLoading(true);
    return this.session.post(this.baseServicesUrl + 'api/v1.0.0/email/send', emailInfo)
      .map((res: any) => {
        let memberSaidHi = new BlandPageDetails(
          "Return to map",
          "<div class='text text-center'>Success!</div>",
          BlandPageType.Text,
          BlandPageCause.Success,
          ''
        );
        this.blandPageService.primeAndGo(memberSaidHi);
        return res;
      })
      .catch((err) => Observable.throw(err.json().error));
  }

  public createTemplateDictionary(user: User, pin: Pin) {
    return {
      'Community_Member_Name': user.firstname + ' ' + user.lastname.charAt(0) + '.',
      'Pin_First_Name': pin.firstName,
      'Community_Member_Email': user.email
    };
  }

  public requestToJoinGathering(gatheringId: number): Observable<boolean> {
    return this.session.post(`${this.baseUrl}api/v1.0.0/finder/pin/gatheringjoinrequest`, gatheringId)
  }

  public inviteToGathering(gatheringId: number, someone: Person): Observable<boolean> {
    return this.session.post(`${this.baseUrl}api/v1.0.0/finder/pin/inviteToGathering/${gatheringId}`, someone);
  }

  public postPin(pin: Pin) {
    let postPinUrl = this.baseUrl + 'api/v1.0.0/finder/pin';

    return this.session.post(postPinUrl, pin)
      .map((res: any) => {
        return res;
      })
      .catch((err) => Observable.throw(err.json().error));
  }

}