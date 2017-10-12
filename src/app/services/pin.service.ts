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
import { BlandPageService } from '../services/bland-page.service';
import { GoogleMapService } from '../services/google-map.service';
import { SiteAddressService } from '../services/site-address.service';
import { SessionService } from './session.service';
import { SmartCacheableService, CacheLevel } from './base-service/cacheable.service';
import { StateService } from '../services/state.service';
import { Group } from '../models/group';

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

import { environment } from '../../environments/environment';

import * as _ from 'lodash';

import { AppType } from '../shared/constants';

@Injectable()
export class PinService extends SmartCacheableService<PinSearchResultsDto, SearchOptions> {
  public restVerbs = { post: 'POST', put: 'PUT' };
  public defaults = { authorized: null };

  private baseUrl = environment.CRDS_GATEWAY_CLIENT_ENDPOINT;
  private baseServicesUrl = environment.CRDS_SERVICES_CLIENT_ENDPOINT;

  public pinSearchRequestEmitter: Subject<PinSearchRequestParams> = new Subject<PinSearchRequestParams>();
  private editedSmallGroupPin: Pin = null;
  private editedGatheringPin: Pin = null;

  constructor(
    private addressService: AddressService,
    private appSettings: AppSettingsService,
    private gatheringService: SiteAddressService,
    private router: Router,
    private session: SessionService,
    private state: StateService,
    private blandPageService: BlandPageService,
    private mapHlpr: GoogleMapService
  ) {
    super();
  }

  public emitPinSearchRequest(requestParams: PinSearchRequestParams): void {
    this.pinSearchRequestEmitter.next(requestParams);
  }

  private createPartialCache(pin: Pin): void {
    let contactId = this.session.getContactId();
    let pinArray = new Array<Pin>();
    pinArray.push(pin);
    super.setSmartCache(
      new PinSearchResultsDto(new GeoCoordinates(0, 0), pinArray),
      CacheLevel.Partial,
      null,
      contactId
    );
  }

  private setPinTypeAsGroupIfInGroupApp(pin: Pin) {
    if (this.appSettings.isSmallGroupApp()) {
      pin.pinType = pinType.SMALL_GROUP;
    }
    return pin;
  }

  // GETS
  public getPinDetails(pinIdentifier: PinIdentifier): Observable<Pin> {
    const contactId = this.session.getContactId() || 0;
    let url: string;
    let pin: Pin;

    pin = this.findPinInCache(contactId, pinIdentifier);
    if (pin != null) {
      return Observable.of<Pin>(pin);
    }

    url =
      pinIdentifier.type === pinType.PERSON
        ? `${this.baseUrl}api/v1.0.0/finder/pin/${pinIdentifier.id}`
        : `${this.baseUrl}api/v1.0.0/finder/pinByGroupID/${pinIdentifier.id}${this.getCorsFriendlySearchParams()}`;

    console.log('PinService got partial new PinSearchResultsDto');

    return this.session
      .get(url)
      .map((res: Pin) => {
        return new Pin(
          res.firstName,
          res.lastName,
          res.emailAddress,
          res.contactId,
          res.participantId,
          res.address,
          res.hostStatus,
          res.gathering,
          res.siteName,
          res.pinType,
          res.proximity,
          res.householdId
        );
      })
      .do((res: Pin) => {
        res = this.setPinTypeAsGroupIfInGroupApp(res);
        this.createPartialCache(res);
      })
      .catch((error: any) => {
        // Todo: this is component level stuff, should not be happening in the service
        this.state.setLoading(false);
        return Observable.throw(error || 'Server error');
      });
  }

  private findPinInCache(contactId: number, pinIdentifier: PinIdentifier): Pin {
    let cachedPins: PinSearchResultsDto;
    if (super.isCachedForUser(contactId)) {
      cachedPins = super.getCache();
      const pin: Pin = cachedPins.pinSearchResults.find(aPin => {
        if (aPin.pinType === pinIdentifier.type) {
          if (pinIdentifier.type === pinType.PERSON) {
            // need == not === here b/c have string and number
            // tslint:disable-next-line:triple-equals
            return aPin.participantId == pinIdentifier.id;
          } else if (pinIdentifier.type === pinType.GATHERING) {
            // tslint:disable-next-line:triple-equals
            return aPin.gathering.groupId == pinIdentifier.id;
          } else if (pinIdentifier.type === pinType.SMALL_GROUP) {
            // tslint:disable-next-line:triple-equals
            return aPin.gathering.groupId == pinIdentifier.id;
          }
        }
      });
      if (pin !== undefined) {
        return pin;
      }
    }
    return null;
  }

  private getCorsFriendlySearchParams() {
    let params = '';
    if (this.state.getMapView() != null) {
      const lat = this.state.getMapView().lat;
      const lng = this.state.getMapView().lng;
      const geoCodeParamsString = `/${lat}/${lng}`;
      params = geoCodeParamsString
        .toString()
        .split('.')
        .join('$');
    }
    return params;
  }

  public getPinSearchResults(params: PinSearchRequestParams): Observable<PinSearchResultsDto> {
    // Todo: this is component level stuff, should not be happening in the service
    this.state.setLoading(true);
    const mapParams: MapView = this.state.getMapView();
    const contactId: number = this.session.getContactId() || 0;
    const findPinsEndpointUrl: string = this.getApiEndpointUrl();
    const apiQueryParams: PinSearchQueryParams = this.buildSearchPinQueryParams(params);
    const searchOptionsForCache = new SearchOptions(
      !!params.userKeywordSearchString ? params.userKeywordSearchString : '',
      !!params.userFilterString ? params.userFilterString : '',
      !!params.userLocationSearchString ? params.userLocationSearchString : ''
    );

    if (super.cacheIsReadyAndValid(searchOptionsForCache, CacheLevel.Full, contactId)) {
      console.log('PinService got full cached PinSearchResultsDto');
      return Observable.of(super.getCache());
    } else {
      return this.session
        .post(findPinsEndpointUrl, apiQueryParams)
        .map(res => this.gatheringService.addAddressesToGatheringPins(res))
        .do((res: PinSearchResultsDto) => {
          super.setSmartCache(res, CacheLevel.Full, searchOptionsForCache, contactId);
          this.state.updateMapView(params, res, this.appSettings.isConnectApp());
          this.state.setLoading(false);
        })
        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
  }

  private clearGeoCoordsIfSearchingLoc(searchLocationString: string, centerGeoCoords: GeoCoordinates): GeoCoordinates {
    const isLocationSearch: boolean = searchLocationString && searchLocationString !== '';

    if (isLocationSearch) {
      return new GeoCoordinates(null, null);
    } else {
      return centerGeoCoords;
    }
  }

  private buildSearchPinQueryParams(params: PinSearchRequestParams): PinSearchQueryParams {
    // TODO: ensure that this is updated on getting initial location - may not be available due to it being an observable
    let mapParams: MapView = this.state.getMapView();
    let isMyStuff: boolean = this.state.myStuffActive;
    let finderType: string = this.appSettings.finderType;
    let contactId: number = this.session.getContactId() || 0;
    let centerGeoCoords: GeoCoordinates = new GeoCoordinates(mapParams.lat, mapParams.lng);
    centerGeoCoords = this.clearGeoCoordsIfSearchingLoc(params.userLocationSearchString, centerGeoCoords);
    let mapBoundingBox: MapBoundingBox = this.mapHlpr.calculateGeoBounds(mapParams);

    let apiQueryParams = new PinSearchQueryParams(
      params.userLocationSearchString,
      params.userKeywordSearchString,
      isMyStuff,
      finderType,
      contactId,
      centerGeoCoords,
      mapBoundingBox,
      params.userFilterString
    );
    console.log('API QUERY PARAMS: ');
    console.log(apiQueryParams);

    return apiQueryParams;
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
    return this.session
      .put(`${this.baseUrl}api/v1.0.0/finder/gathering/edit`, pin)
      .do((res: any) => super.clearCache()) // Maybe update cache for this pin?
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public editGroup(group: Group): Observable<Group> {
    const contactId = this.session.getContactId() || 0;
    return this.session.post(`${this.baseUrl}api/v1.0.0/group/edit`, group).do((res: any) => {
      let cachedPins: PinSearchResultsDto;
      if (super.isCachedForUser(contactId)) {
        cachedPins = super.getCache();
        const idx = cachedPins.pinSearchResults.findIndex(aPin => {
          // tslint:disable-next-line:triple-equals
          return aPin.gathering.groupId == group.groupId;
        });
        cachedPins.pinSearchResults[idx].gathering = group;
      } else {
        //should we create a partial cache and put the new group in it?
      }
      return null;
    });
  }

  public createGroup(group: Group): Observable<Group> {
    return this.session.post(`${this.baseUrl}api/v1.0.0/group`, group);
  }

  public postPin(pin: Pin) {
    let postPinUrl = this.baseUrl + 'api/v1.0.0/finder/pin';

    return this.session
      .post(postPinUrl, pin)
      .map((res: any) => {
        super.clearCache();
        return res;
      })
      .catch(err => Observable.throw(err.json().error));
  }

  public removePersonPin(participantId: number) {
    let removePersonPinUrl = this.baseUrl + 'api/v1.0.0/finder/pin/removeFromMap';

    return this.session
      .post(removePersonPinUrl, participantId)
      .map((res: any) => {
        return res;
      })
      .catch(err => Observable.throw(err.json().error));
  }

  public doesLoggedInUserOwnPin(pin: Pin) {
    let contactId = this.session.getContactId();
    return contactId === pin.contactId;
  }

  public clearPinCache() {
    super.clearCache();
  }

  // Not sure this belongs here
  public navigateToPinDetailsPage(pin: Pin): void {
    if (pin.pinType === pinType.PERSON) {
      this.router.navigate([`person/${pin.participantId}/`]);
    } else if (pin.pinType === pinType.GATHERING) {
      this.router.navigate([`gathering/${pin.gathering.groupId}/`]);
    } else if (pin.pinType === pinType.SMALL_GROUP) {
      this.router.navigate([`small-group/${pin.gathering.groupId}/`]);
    }
  }

  public buildPinSearchRequest(
    textInLocationSearchBar: string,
    textInKeywordSearchBar: string,
    filterString: string = null
  ): PinSearchRequestParams {
    const isTextInSearchBar: boolean = textInLocationSearchBar && textInLocationSearchBar !== '';
    const searchString = textInLocationSearchBar ? textInLocationSearchBar : '';
    const srchParams: PinSearchRequestParams = new PinSearchRequestParams(
      searchString,
      textInKeywordSearchBar,
      filterString
    );
    return srchParams;
  }
}
