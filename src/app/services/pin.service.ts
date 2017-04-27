import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { SmartCacheableService, CacheLevel } from './base-service/cacheable.service';


import { SiteAddressService } from '../services/site-address.service';
import { SessionService } from './session.service';
import { sayHiTemplateId } from '../shared/constants';
import { StateService } from '../services/state.service';
import { BlandPageService } from '../services/bland-page.service';
import { IFrameParentService } from './iframe-parent.service';

import { GoogleMapService } from '../services/google-map.service';

import { Address } from '../models/address';
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


  private baseUrl = process.env.CRDS_GATEWAY_CLIENT_ENDPOINT;
  private baseServicesUrl = process.env.CRDS_SERVICES_CLIENT_ENDPOINT;

  public SayHiTemplateId: number;
  public restVerbs = { post: 'POST', put: 'PUT' };
  public defaults = { authorized: null };

  constructor(
    private gatheringService: SiteAddressService,
    private session: SessionService,
    private state: StateService,
    private blandPageService: BlandPageService,
    private mapHlpr: GoogleMapService
  ) {
    super();
    this.SayHiTemplateId = sayHiTemplateId;
  }

  private createPartialCache(pin: Pin): void {
    let contactId = this.session.getContactId();
    let pinArray = new Array<Pin>();
    pinArray.push(pin);
    super.setSmartCache(new PinSearchResultsDto(new GeoCoordinates(0, 0), pinArray), CacheLevel.Partial, null, contactId);
  }

  // GETS
  public getPinDetails(pinIdentifier: PinIdentifier): Observable<Pin> {
    let contactId = this.session.getContactId();
    let cachedPins: PinSearchResultsDto;
    let pin: Pin;
    let url: string;

    if (super.isCachedForUser(contactId)) {
      cachedPins = super.getCache();
      pin = cachedPins.pinSearchResults.find(aPin => {
        if (aPin.pinType == pinIdentifier.type) {
          if (pinIdentifier.type == pinType.PERSON) {
            return (aPin.participantId == pinIdentifier.id);
          } else {
            return (aPin.gathering) && (aPin.gathering.groupId == pinIdentifier.id);
          }
        } else {
          return false;
        }
      });
      if (pin != null) {
        console.log('PinService got partial cached PinSearchResultsDto');
        return Observable.of<Pin>(pin);
      }
    }
    url = pinIdentifier.type === pinType.PERSON ?
      `${this.baseUrl}api/v1.0.0/finder/pin/${pinIdentifier.id}` :
      `${this.baseUrl}api/v1.0.0/finder/pinByGroupID/${pinIdentifier.id}`;

    console.log('PinService got partial new PinSearchResultsDto');

    return this.session.get(url)
      .map((res: Pin) => { return new Pin(res.firstName, res.lastName, res.emailAddress, res.contactId,
      res.participantId, res.address, res.hostStatus, res.gathering, res.siteName, res.pinType, res.proximity, res.householdId); })
      .do((res: Pin) => this.createPartialCache(res))
      .catch((error: any) => {
        this.state.setLoading(false);
        return Observable.throw(error || 'Server error');
      });
  }

  public getPinSearchResults(userSearchAddress: string, lat?: number, lng?: number, zoom?: number): Observable<PinSearchResultsDto> {
    let contactId = this.session.getContactId();
    let searchOptions: SearchOptions;

    if (this.state.getMyViewOrWorldView() === 'world') {
      searchOptions = new SearchOptions(userSearchAddress, lat, lng);
      if (super.cacheIsReadyAndValid(searchOptions, CacheLevel.Full, contactId)) {
        return Observable.of(super.getCache());
      } else {
        return this.getPinSearchResultsWorld(searchOptions, contactId, userSearchAddress, lat, lng, zoom);
      }
    } else {  // getMyViewOrWorldView = 'my'
      searchOptions = new SearchOptions('myView', lat, lng);
      if (super.cacheIsReadyAndValid(searchOptions, CacheLevel.Full, contactId)) {
        return Observable.of(super.getCache());
      } else {
        return this.getPinSearchResultsMyStuff(searchOptions, contactId, lat, lng);
      }
    }
  }

  private getPinSearchResultsWorld(searchOptions: SearchOptions
    , contactId: number
    , userSearchAddress: string
    , lat?: number
    , lng?: number
    , zoom?: number): Observable<PinSearchResultsDto> {
    let searchUrl: string = lat && lng ?
      'api/v1.0.0/finder/findpinsbyaddress/' + userSearchAddress
      + '/' + lat.toString().split('.').join('$') + '/'
      + lng.toString().split('.').join('$') :
      'api/v1.0.0/finder/findpinsbyaddress/' + userSearchAddress;
    // if we have a cache AND that cache came from a full search and
    // not just an insert from visiting a detail page off the bat, use that cache
    if (super.cacheIsReadyAndValid(searchOptions, CacheLevel.Full, contactId)) {

      console.log('PinService got full cached PinSearchResultsDto');
      return Observable.of(super.getCache());
    } else {
      let searchUrlZoom: string;
      if (lat && lng) {
        if (zoom) {
          // call to get bounding box
          let bounds = {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
            lat: lat,
            lng: lng
          };
          // get extra pins for moving around without new query
          let geobounds = this.mapHlpr.calculateGeoBounds(bounds, zoom - 1);
          searchUrlZoom = 'api/v1.0.0/finder/findpinsbyaddress/' + userSearchAddress
            + '/' + lat.toString().split('.').join('$')
            + '/' + lng.toString().split('.').join('$')
            + '/' + ('' + geobounds['north']).split('.').join('$')
            + '/' + ('' + geobounds['west']).split('.').join('$')
            + '/' + ('' + geobounds['south']).split('.').join('$')
            + '/' + ('' + geobounds['east']).split('.').join('$');
        } else {
          searchUrlZoom = 'api/v1.0.0/finder/findpinsbyaddress/' + userSearchAddress
            + '/' + lat.toString().split('.').join('$')
            + '/' + lng.toString().split('.').join('$');
        }
      } else {
        searchUrlZoom = 'api/v1.0.0/finder/findpinsbyaddress/' + userSearchAddress;
      }

      return this.session.get(this.baseUrl + searchUrlZoom)
        // when we get the new results, set them to the cache
        .do((res: PinSearchResultsDto) => super.setSmartCache(res, CacheLevel.Full, searchOptions, contactId))
        .map(res => this.gatheringService.addAddressesToGatheringPins(res))
        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
  }

  private getPinSearchResultsMyStuff(searchOptions: SearchOptions
    , contactId: number
    , lat?: number
    , lng?: number): Observable<PinSearchResultsDto> {
    const geoCodeString = `/${lat}/${lng}`;
    let corsFriendlyGeoCode = geoCodeString.toString().split('.').join('$');

    return this.session.get(`${this.baseUrl}api/v1.0.0/finder/findmypinsbycontactid/${contactId}${corsFriendlyGeoCode}`)
      .do((res: PinSearchResultsDto) => super.setSmartCache(res, CacheLevel.Full, searchOptions, contactId))
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  // PUTS
  public updateGathering(pin: Pin): Observable<Pin> {
    return this.session.put(`${this.baseUrl}api/v1.0.0/finder/gathering/edit`, pin)
    .do((res: any) => super.clearCache()) // Maybe update cache for this pin?
    .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  // POSTS
  public sendHiEmail(user: Pin, pin: Pin): Observable<any> {
    // Create merge data for this template
    let emailInfo = {
      'fromEmailAddress': user.emailAddress,
      'toEmailAddress': pin.emailAddress,
      'subject': 'Hi',
      'body': 'Just wanted to say hi',
      'mergeData': this.createSayHiTemplateDictionary(user, pin),
      'templateId': this.SayHiTemplateId
    };

    this.state.setLoading(true);
    return this.session.post(this.baseServicesUrl + 'communication/api/v1.0.0/email/send', emailInfo)
      .map((res: any) => {

        let memberSaidHi = new BlandPageDetails(
          'Return to map',
          '<h1 class="title text-lowercase">Success!</h1>',
          BlandPageType.Text,
          BlandPageCause.Success,
          ''
        );
        this.blandPageService.primeAndGo(memberSaidHi);
        return res;
      })
      .catch((err) => Observable.throw(err.json().error));
  }

  public createSayHiTemplateDictionary(user: Pin, pin: Pin) {
    return {
      'Community_Member_Name': user.firstName + ' ' + user.lastName.charAt(0) + '.',
      'Pin_First_Name': pin.firstName,
      'Community_Member_Email': user.emailAddress,
      'Community_Member_City': user.address.city,
      'Community_Member_State': user.address.state
    };
  }

  public requestToJoinGathering(gatheringId: number): Observable<boolean> {
    return this.session.post(`${this.baseUrl}api/v1.0.0/finder/pin/gatheringjoinrequest`, gatheringId);
  }

  public inviteToGathering(gatheringId: number, someone: Person): Observable<boolean> {
    return this.session.post(`${this.baseUrl}api/v1.0.0/finder/pin/inviteToGathering/${gatheringId}`, someone);
  }

  public postPin(pin: Pin) {
    let postPinUrl = this.baseUrl + 'api/v1.0.0/finder/pin';

    return this.session.post(postPinUrl, pin)
      .map((res: any) => {
        super.clearCache();
        return res;
      })
      .catch((err) => Observable.throw(err.json().error));
  }

  public removePersonPin(participantId: number) {
    let removePersonPinUrl = this.baseUrl + 'api/v1.0.0/finder/pin/removeFromMap';
    super.clearCache();
    this.pin.clearCache();
    
    return this.session.post(removePersonPinUrl, participantId);

  } 

  public doesLoggedInUserOwnPin(pin: Pin) {
    let contactId = this.session.getContactId();
    return contactId === pin.contactId;
  }

  public getCachedSearchResults(searchString: string, lat: number, lng: number, contactId: number): PinSearchResultsDto {
    const searchOptions = new SearchOptions(searchString, lat, lng);
    if (super.cacheIsReadyAndValid(searchOptions, CacheLevel.Full, contactId)) {
      return super.getCache();
    }
    return null;
  }

  public replaceAddressOnUpdatedPin(pinSearchResults: Pin[], updatedPin: Pin, updatedPinsOldAddress: Address) {

    let indexOfUpdatedPin = pinSearchResults.findIndex(pin =>
      pin.participantId === updatedPin.participantId
      && pin.address.addressId === updatedPinsOldAddress.addressId
    );

    let updatedPinFound: boolean = indexOfUpdatedPin !== -1;

    if (updatedPinFound) {
      pinSearchResults[indexOfUpdatedPin].address = updatedPin.address;
    }

    return pinSearchResults;
  }

  public clearPinCache() {
    super.clearCache();
  }

}
