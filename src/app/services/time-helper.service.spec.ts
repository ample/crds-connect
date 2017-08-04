import { TestBed, inject, async } from '@angular/core/testing';

import { TimeHelperService } from './time-helper.service';

describe('Service: Location', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimeHelperService]
    });
  });

  it('should create an instance', inject([TimeHelperService], (service: any) => {
    expect(service).toBeTruthy();
  }));

  it('should return the correct time', inject([TimeHelperService], (service: any) => {
    let testResult1: string = service.adjustUtcStringToAccountForLocalOffSet('0001-01-01T02:00:00.000Z', true);
    let expected1 = '0001-01-01T21:00:00.000Z';
    let testResult2: string = service.adjustUtcStringToAccountForLocalOffSet('0001-01-01T17:00:00.000Z', true);
    let expected2 = '0001-01-01T12:00:00.000Z';
    let testResult3: string = service.adjustUtcStringToAccountForLocalOffSet('0001-01-01T24:00:00.000Z', true);
    let expected3 = '0001-01-01T19:00:00.000Z';
    let testResult4: string = service.adjustUtcStringToAccountForLocalOffSet('0001-01-01T19:00:00.000Z', false);
    let expected4 = '0001-01-01T00:00:00.000Z';
    let testResult5: string = service.adjustUtcStringToAccountForLocalOffSet('0001-01-01T23:00:00.000Z', false);
    let expected5 = '0001-01-01T04:00:00.000Z';
    let testResult6: string = service.adjustUtcStringToAccountForLocalOffSet('0001-01-01T02:00:00.000Z', false);
    let expected6 = '0001-01-01T07:00:00.000Z';

    expect(testResult1).toEqual(expected1);
    expect(testResult2).toEqual(expected2);
    expect(testResult3).toEqual(expected3);
    expect(testResult4).toEqual(expected4);
    expect(testResult5).toEqual(expected5);
    expect(testResult6).toEqual(expected6);


  }));


});
