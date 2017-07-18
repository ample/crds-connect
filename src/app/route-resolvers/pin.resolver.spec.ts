import { Observable } from 'rxjs/Rx';

/*
 * Testing a route guard
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#isolated-unit-tests
 *            https://angular.io/docs/ts/latest/guide/router.html#!#guards
 */

import { BlandPageService } from '../services/bland-page.service';
import { PinService } from '../services/pin.service';
import { PinResolver } from './pin-resolver.service';
import { Pin, PinIdentifier, pinType } from '../models';
import { Http, Response, ResponseOptions } from '@angular/http';

describe('PinResolver', () => {
  let guard;

  let fakeRouter: any = { };
  let fakeRouterState: any = { }; // RouterStateSnapshot
  let fakeActivatedRoute: any; // ActivatedRouteSnapshot
  let mockPinService: any = jasmine.createSpyObj<PinService>('pinService', ['getPinDetails']);
  let mockBlandPageService: any = jasmine.createSpyObj<BlandPageService>('blandPageService', ['primeAndGo']);

  beforeEach(() => {
    guard = new PinResolver(mockPinService, mockBlandPageService);
  });

  it('should resolve person pin', () => {
    (mockPinService.getPinDetails).and.returnValue(Observable.of({}));
    let participantId = 1234;
    // canActivate, canActivateChild, canDeactivate, resolve, canLoad
    let result = guard.resolve({
      // example route in here
      path: `person/${participantId}`,
      url: [{path: 'person'}, `${participantId}`],
      params: { participantId: participantId }
    });
    expect(mockPinService.getPinDetails).toHaveBeenCalledWith(new PinIdentifier(pinType.PERSON, participantId));
  });

  it('should resolve gathering pin', () => {
    (mockPinService.getPinDetails).and.returnValue(Observable.of({}));
    let gatheringId = 1337;
    // canActivate, canActivateChild, canDeactivate, resolve, canLoad
    let result = guard.resolve({
      // example route in here
      path: `gathering/${gatheringId}`,
      url: [{path: 'gathering'}, `${gatheringId}`],
      params: { groupId: gatheringId }
    });
    expect(mockPinService.getPinDetails).toHaveBeenCalledWith(new PinIdentifier(pinType.GATHERING, gatheringId));
  });

  it('should resolve small group pin', () => {
    (mockPinService.getPinDetails).and.returnValue(Observable.of({}));
    let groupId = 8754;
    // canActivate, canActivateChild, canDeactivate, resolve, canLoad
    let result = guard.resolve({
      // example route in here
      path: `small-group/${groupId}`,
      url: [{path: 'small-group'}, `${groupId}`],
      params: { groupId: groupId}
    });
    expect(mockPinService.getPinDetails).toHaveBeenCalledWith(new PinIdentifier(pinType.SMALL_GROUP, groupId));
  });
});
