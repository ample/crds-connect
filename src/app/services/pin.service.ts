import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { AddressService } from '../services/address.service';
import { AppSettingsService } from '../services/app-settings.service';
import { BlandPageService } from '../services/bland-page.service';;
import { GoogleMapService } from '../services/google-map.service';
import { SiteAddressService } from '../services/site-address.service';
import { SessionService } from './session.service';
import { SmartCacheableService, CacheLevel } from './base-service/cacheable.service';
import { StateService } from '../services/state.service';
import { IFrameParentService } from './iframe-parent.service';

import { Address } from '../models/address';
import { MapView } from '../models/map-view';
import { MapBoundingBox } from '../models/map-bounding-box';
import { Pin, pinType } from '../models/pin';
import { PinIdentifier } from '../models/pin-identifier';
import { Person } from '../models/person';
import { PinSearchResultsDto } from '../models/pin-search-results-dto';
import { PinSearchRequestParams } from '../models/pin-search-request-params';
import { PinSearchQueryParams } from '../models/pin-search-query-params';
import { GeoCoordinates } from '../models/geo-coordinates';
import { BlandPageDetails, BlandPageCause, BlandPageType } from '../models/bland-page-details';
import { SearchOptions } from '../models/search-options';
import { User } from '../models/user';

import * as _ from 'lodash';

import { app, App, sayHiTemplateId, earthsRadiusInMiles } from '../shared/constants'


@Injectable()
export class PinService extends SmartCacheableService<PinSearchResultsDto, SearchOptions> {

  public SayHiTemplateId: number;
  public restVerbs = { post: 'POST', put: 'PUT' };
  public defaults = { authorized: null };

  private baseUrl = process.env.CRDS_GATEWAY_CLIENT_ENDPOINT;
  private baseServicesUrl = process.env.CRDS_SERVICES_CLIENT_ENDPOINT;

  public pinSearchRequestEmitter: Subject<PinSearchRequestParams> = new Subject<PinSearchRequestParams>();

  constructor(
    private addressService: AddressService,
    private appSetting: AppSettingsService,
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


  public emitPinSearchRequest(requestParams: PinSearchRequestParams): void {
    this.pinSearchRequestEmitter.next(requestParams);
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
    let contactId = this.session.getContactId() || 0;
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

  private updateMapView(srchParams: PinSearchRequestParams, srchRes: PinSearchResultsDto): void {

    let lastSearchString: string = srchParams.userSearchString;
    let lat: number = srchRes.centerLocation.lat;
    let lng: number = srchRes.centerLocation.lng;
    let zoom: number = this.mapHlpr.calculateZoom(15, lat, lng, srchRes.pinSearchResults, this.state.getMyViewOrWorldView());

    let mapView: MapView = new MapView(lastSearchString, lat, lng, zoom );

    this.state.setMapView(mapView);
  }

  public getPinSearchResults(params: PinSearchRequestParams): Observable<PinSearchResultsDto> {
    this.state.setLoading(true);
    let mapParams: MapView = this.state.getMapView();
    let searchOptionsForCache = new SearchOptions(params.userSearchString, mapParams.lat, mapParams.lng);

    let contactId: number = this.session.getContactId() || 0;

    let findPinsEndpointUrl: string =  this.getApiEndpointUrl();

    let apiQueryParams: PinSearchQueryParams = this.buildSearchPinQueryParams(params);

    if (super.cacheIsReadyAndValid(searchOptionsForCache, CacheLevel.Full, contactId)) {
      console.log('PinService got full cached PinSearchResultsDto');
      return Observable.of(super.getCache());
    } else {
      return this.session.post(findPinsEndpointUrl, apiQueryParams)
        .map(res => this.gatheringService.addAddressesToGatheringPins(res))
        .do((res: PinSearchResultsDto) => {
          res.pinSearchResults = this.removeOwnPinFromSearchResultsIfNecessary(res.pinSearchResults, contactId);
          super.setSmartCache(res, CacheLevel.Full, searchOptionsForCache, contactId);
          this.updateMapView(params, res);
          this.state.setLoading(false);
        })
        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
  }

  private buildSearchPinQueryParams(params: PinSearchRequestParams): PinSearchQueryParams {

    let mapParams: MapView = this.state.getMapView(); // TODO: ensure that this is updated on getting initial location - may not be available due to it being an observable
    let searchOptionsForCache = new SearchOptions(params.userSearchString, mapParams.lat, mapParams.lng);

    let userSearchString: string = params.userSearchString; //redundant
    let isLocationSearch: boolean = params.isLocationSearch; //redundant
    let isMyStuff: boolean = this.state.myStuffActive;
    let finderType: string = this.appSetting.finderType;
    let contactId: number = this.session.getContactId() || 0;
    let centerGeoCoords: GeoCoordinates = new GeoCoordinates(mapParams.lat, mapParams.lng);
    if (userSearchString) {centerGeoCoords = new GeoCoordinates(null, null);}
    let mapBoundingBox: MapBoundingBox = this.mapHlpr.calculateGeoBounds(mapParams);

    let apiQueryParams = new PinSearchQueryParams(userSearchString, isLocationSearch,isMyStuff, finderType,
                                                  contactId, centerGeoCoords, mapBoundingBox);

    console.log('API QUERY PARAMS: ');
    console.log(apiQueryParams);

    return apiQueryParams;
  }

  private removeOwnPinFromSearchResultsIfNecessary(pins: Pin[], contactId: number): Pin[]{
    if ( this.state.removedSelf) {
      this.state.removedSelf = false;
      let index = pins.findIndex(obj => obj.pinType === pinType.PERSON && obj.contactId === contactId);
      if (index > -1) {
        pins.splice(index, 1);
      }
    }

    return pins;
  }

  private getApiEndpointUrl() {

    let endPointUrl: string = this.baseUrl;

    if (!this.state.myStuffActive) {
      endPointUrl += 'api/v1.0.0/finder/findpinsbyaddress/';
    } else {
      endPointUrl += 'api/v1.0.0/finder/findmypinsbycontactid/';
    }

    return endPointUrl;
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

  public addNewPinToResultsIfNotUpdatedInAwsYet(pinsFromServer: Pin[]): Pin[] {

    let wasFreshPinJustAdded: boolean = this.state.navigatedFromAddToMapComponent && !!this.state.postedPin;

    if (wasFreshPinJustAdded) {
      this.state.navigatedFromAddToMapComponent = false;
      let isFound = pinsFromServer.find(this.foundPinElement);
      let pin = this.state.postedPin;
      if (isFound === undefined) {
        pinsFromServer.push(pin);
      } else {
        pinsFromServer = pinsFromServer.filter(this.filterFoundPinElement);
        pinsFromServer.push(pin);
      }
      this.addressService.clearCache();
      this.state.postedPin = null;
    }

    return pinsFromServer;
  }

  private foundPinElement = (pinFromResults: Pin): boolean => {
    let postedPin = this.state.postedPin;
    return (postedPin.participantId === pinFromResults.participantId
    && postedPin.pinType === pinFromResults.pinType);
  };

  private filterFoundPinElement = (pinFromResults: Pin): boolean => {
    let postedPin = this.state.postedPin;
    return (postedPin.participantId !== pinFromResults.participantId || postedPin.pinType !== pinFromResults.pinType);
  };

  public ensureUpdatedPinAddressIsDisplayed(pinsFromServer: Pin[]): Pin[] {
    let wasPinAddressJustUpdated: boolean = !!this.state.navigatedFromAddToMapComponent && !!this.state.updatedPin;

    if (wasPinAddressJustUpdated) {

      pinsFromServer = this.replaceAddressOnUpdatedPin(pinsFromServer, this.state.updatedPin,
                                                       this.state.updatedPinOldAddress);

      this.addressService.clearCache();

      this.state.cleanUpStateAfterPinUpdate();

    }

    return pinsFromServer;
  }

}
