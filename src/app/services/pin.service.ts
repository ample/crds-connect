import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch'; //TODO: Can probable delete these
import 'rxjs/add/operator/map'; //TODO: Can probable delete these

import { BlandPageService } from '../services/bland-page.service';;
import { GoogleMapService } from '../services/google-map.service';
import { SiteAddressService } from '../services/site-address.service';
import { SessionService } from './session.service';
import { SmartCacheableService, CacheLevel } from './base-service/cacheable.service';
import { StateService } from '../services/state.service';
import { IFrameParentService } from './iframe-parent.service';

import { Address } from '../models/address';
import { Pin, pinType } from '../models/pin';
import { PinIdentifier } from '../models/pin-identifier';
import { User } from '../models/user';
import { Person } from '../models/person';
import { PinSearchResultsDto } from '../models/pin-search-results-dto';
import { PinSearchQueryParams } from '../models/pin-search-query-params';
import { GeoCoordinates } from '../models/geo-coordinates';
import { BlandPageDetails, BlandPageCause, BlandPageType } from '../models/bland-page-details';
import { SearchOptions } from '../models/search-options';
import * as _ from 'lodash';

import { app, App, sayHiTemplateId, earthsRadiusInMiles } from '../shared/constants'


@Injectable()
export class PinService extends SmartCacheableService<PinSearchResultsDto, SearchOptions> {

  private baseUrl = process.env.CRDS_GATEWAY_CLIENT_ENDPOINT;
  private baseServicesUrl = process.env.CRDS_SERVICES_CLIENT_ENDPOINT;

  public SayHiTemplateId: number;
  public restVerbs = { post: 'POST', put: 'PUT' };
  public defaults = { authorized: null };

  constructor(
    private gatheringService: SiteAddressService,
    private router: Router,
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

  private setPinTypeAsGroupIfInGroupApp(pin: Pin){
    let isGroupPin: boolean = this.state.activeApp === app.SMALL_GROUPS;

    if (isGroupPin) {
      pin.pinType = pinType.SMALL_GROUP;
    }

    return pin;
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
        if (aPin.pinType === pinIdentifier.type) {
          if (pinIdentifier.type === pinType.PERSON) {
            return (aPin.participantId === pinIdentifier.id);
          } else {
            return (aPin.gathering) && (aPin.gathering.groupId === pinIdentifier.id);
          }
        } else {
          return false;
        }
      });
      if (pin != null) {
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
      .do((res: Pin) => {
        res = this.setPinTypeAsGroupIfInGroupApp(res);
        this.createPartialCache(res)
      })
      .catch((error: any) => {
        this.state.setLoading(false);
        return Observable.throw(error || 'Server error');
      });
  }

  public getPinSearchResults(userSearchAddress: string, finderType: string
                            , lat?: number, lng?: number, zoom?: number): Observable<PinSearchResultsDto> {
    let contactId = this.session.getContactId();
    let searchOptions: SearchOptions;

    if (this.state.getMyViewOrWorldView() === 'world') {
      searchOptions = new SearchOptions(userSearchAddress, lat, lng);
      if (super.cacheIsReadyAndValid(searchOptions, CacheLevel.Full, contactId)) {
        return Observable.of(super.getCache());
      } else {
        return this.getPinSearchResultsWorld(searchOptions, finderType, contactId, userSearchAddress, lat, lng, zoom);
      }
    } else {  // getMyViewOrWorldView = 'my'
      searchOptions = new SearchOptions('myView', lat, lng);
      if (super.cacheIsReadyAndValid(searchOptions, CacheLevel.Full, contactId)) {
        return Observable.of(super.getCache());
      } else {
        return this.getPinSearchResultsMyStuff(searchOptions, contactId, finderType, lat, lng);
      }
    }
  }



  private getPinSearchResultsWorld(searchOptions: SearchOptions
    , finderType: string
    , contactId: number
    , userSearchAddress: string
    , lat?: number
    , lng?: number
    , zoom?: number): Observable<PinSearchResultsDto> {
    contactId = contactId || 0;
    let searchUrl: string = lat && lng ?
      'api/v1.0.0/finder/findpinsbyaddress/' + userSearchAddress + '/' + finderType + '/' + contactId
      + '/' + lat.toString().split('.').join('$') + '/'
      + lng.toString().split('.').join('$') :
      'api/v1.0.0/finder/findpinsbyaddress/' + userSearchAddress + '/' + finderType + '/' + contactId;
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
          searchUrlZoom = 'api/v1.0.0/finder/findpinsbyaddress/' + userSearchAddress  + '/' + finderType
            + '/' + contactId
            + '/' + lat.toString().split('.').join('$')
            + '/' + lng.toString().split('.').join('$')
            + '/' + ('' + geobounds['north']).split('.').join('$')
            + '/' + ('' + geobounds['west']).split('.').join('$')
            + '/' + ('' + geobounds['south']).split('.').join('$')
            + '/' + ('' + geobounds['east']).split('.').join('$');
        } else {
          searchUrlZoom = 'api/v1.0.0/finder/findpinsbyaddress/' + userSearchAddress  + '/' + finderType
            + '/' + contactId
            + '/' + lat.toString().split('.').join('$')
            + '/' + lng.toString().split('.').join('$');
        }
      } else {
        searchUrlZoom = 'api/v1.0.0/finder/findpinsbyaddress/' + userSearchAddress  + '/' + finderType + '/' + contactId;
      }

      return this.session.get(this.baseUrl + searchUrlZoom)
        // when we get the new results, set them to the cache
        .map(res => this.gatheringService.addAddressesToGatheringPins(res))
        .do((res: PinSearchResultsDto) => {
          if ( this.state.removedSelf) {
            this.state.removedSelf = false;
            let index = res.pinSearchResults.findIndex(obj => obj.pinType === pinType.PERSON && obj.contactId === contactId);
            if (index > -1) {
                // remove my pin locally because AWS will take some time to remove from Cloudsearch
                res.pinSearchResults.splice(index, 1);
            }
          }
          super.setSmartCache(res, CacheLevel.Full, searchOptions, contactId);
        })
        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
  }

  private getPinSearchResultsMyStuff(searchOptions: SearchOptions
    , contactId: number
    , finderType: string
    , lat?: number
    , lng?: number): Observable<PinSearchResultsDto> {

    const geoCodeParamsString = `/${lat}/${lng}`;
    let corsFriendlyGeoCodeParams = geoCodeParamsString.toString().split('.').join('$');

    return this.session.get(`${this.baseUrl}api/v1.0.0/finder/findmypinsbycontactid/${contactId}${corsFriendlyGeoCodeParams}/${finderType}`)
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
    this.logSayHi(user.contactId, pin.contactId).subscribe();
    return this.session.post(this.baseServicesUrl + 'communication/api/v1.0.0/email/send', emailInfo)
      .map((res: any) => {

        let memberSaidHi = new BlandPageDetails(
          'Return to map',
          '<h1 class="title">Success!</h1>',
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

  public logSayHi(fromId: number, toId: number): Observable<boolean> {
    return this.session.post(`${this.baseUrl}api/v1.0.0/finder/sayhi/${fromId}/${toId}`, null);
  }

  public requestToJoinGathering(gatheringId: number): Observable<boolean> {
    return this.session.post(`${this.baseUrl}api/v1.0.0/finder/pin/gatheringjoinrequest`, gatheringId);
  }

  public inviteToGroup(groupId: number, someone: Person, finderType: string): Observable<boolean> {
    return this.session.post(`${this.baseUrl}api/v1.0.0/finder/pin/invitetogroup/${groupId}/${finderType}`, someone);
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

    return this.session.post(removePersonPinUrl, participantId)
       .map((res: any) => {
        return res;
       })
       .catch((err) => Observable.throw(err.json().error));
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

  public areLastResultsFromActiveApp (currentApp: string, lastResultsApp: string): boolean {
    return currentApp === lastResultsApp;
  };

  public reSortBasedOnCenterCoords(pinSearchResults: Pin[], coords: GeoCoordinates) {
    _.forEach(pinSearchResults, (pin) => {
      pin.proximity = this.calculateProximity(coords, pin.address);
    });

    return this.sortPins(pinSearchResults);
  }

  private calculateProximity(coords: GeoCoordinates, address: Address) {
    let pi = Math.PI;
    // convert degrees to radians
    let a1 = coords.lat * (pi / 180);
    let b1 = coords.lng * (pi / 180);
    let a2 = address.latitude * (pi / 180);
    let b2 = address.longitude * (pi / 180);
    return Math.acos(Math.cos(a1) * Math.cos(b1) * Math.cos(a2) * Math.cos(b2)
      + Math.cos(a1) * Math.sin(b1) * Math.cos(a2) * Math.sin(b2)
      + Math.sin(a1) * Math.sin(a2)) * earthsRadiusInMiles;
  }


  public sortPinsAndRemoveDuplicates(pinSearchResults: Pin[]): Pin[] {
    let sortedPins: Pin[] = this.sortPins(pinSearchResults);
    let sortedAndUniquePins: Pin[] = this.removeDuplicatePins(sortedPins);

    return sortedAndUniquePins;
  };

  public sortPins(pinSearchResults: Pin[]): Pin[] {

    let sortedPinSearchResults: Pin[] =
      pinSearchResults.sort(
        (p1: Pin, p2: Pin) => {
          if (p1.proximity !== p2.proximity) {
            return p1.proximity - p2.proximity; // asc
          } else if (p1.firstName && p2.firstName && (p1.firstName !== p2.firstName)) {
            return p1.firstName.localeCompare(p2.firstName); // asc
          } else if (p1.lastName && p2.lastName && (p1.lastName !== p2.lastName)) {
            return p1.lastName.localeCompare(p2.lastName); // asc
          } else {
            return p2.pinType - p1.pinType; // des
          }
      });

    return sortedPinSearchResults;
  }

  public removeDuplicatePins(pinSearchResults: Pin[]): Pin[] {

    let lastIndex = -1;

    let uniquePins: Pin[] = pinSearchResults.filter( (p, index, self) => {

      let isGroupOrGatheringPin: boolean = p.pinType === pinType.GATHERING || p.pinType === pinType.SMALL_GROUP;

      if (isGroupOrGatheringPin) {
        lastIndex = -1;
        return true;
      } else if (lastIndex === -1) {
        lastIndex = index;
        return true;
      } else {
        let pl = self[lastIndex];
        let test = (p.proximity !== pl.proximity) ||
          (p.firstName !== pl.firstName) ||
          (p.lastName !== pl.lastName);
        if (test) {
          lastIndex = index;
        }
        return test;
      }
    });

    return uniquePins;
  }

  public clearPinCache() {
    super.clearCache();
  }

  public navigateToPinDetailsPage(pin: Pin): void {
    if (pin.pinType === pinType.PERSON) {
      this.router.navigate([`person/${pin.participantId}/`]);
    } else if (pin.pinType === pinType.GATHERING) {
      this.router.navigate([`gathering/${pin.gathering.groupId}/`]);
    } else if (pin.pinType === pinType.SMALL_GROUP) {
      this.router.navigate([`small-group/${pin.gathering.groupId}/`]);
    }
  }

  //TODO: Define query params and return type (Observable<PinDto>
  public searchPins(queryParams: any): Subject<PinSearchResultsDto>  {

    let subject: Subject<PinSearchResultsDto>  = new Subject();



    return subject;

  }

}
