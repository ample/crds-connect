import { EventEmitter  } from '@angular/core';
import { Injectable } from '@angular/core';

import { Pin } from '../models/pin';

import * as moment from 'moment';

const msInMinute: number = 60000;
const minutesAddedInexplicably: number = 3;

@Injectable()
export class TimeHelperService {

  public adjustUtcStringToAccountForLocalOffSet(utcTime: string, isConvertingToLocal: boolean): string {

    let lengthOfUtcHourSegment: number = 2;

    let dt = new Date(utcTime);
    let currentTimeZoneOffsetInHours: number = dt.getTimezoneOffset() / 60;
    let startOfHourSegmentIdx: number = utcTime.indexOf('T') + 1;
    let endOfHourSegmentIdx: number = startOfHourSegmentIdx + lengthOfUtcHourSegment;
    let utcHourSegment: string = utcTime.substring(startOfHourSegmentIdx, endOfHourSegmentIdx);
    let adjustedHourSegment: string = this.adjustHourSegmentForOffset(Number(utcHourSegment), currentTimeZoneOffsetInHours, isConvertingToLocal).toString();
    adjustedHourSegment = adjustedHourSegment == '0' ? adjustedHourSegment = '00' : adjustedHourSegment;
    adjustedHourSegment = this.addLeadingZeroIfMissing(adjustedHourSegment);
    let utcStringAsArray: string[] = utcTime.split('');
    utcStringAsArray.splice(startOfHourSegmentIdx, lengthOfUtcHourSegment, adjustedHourSegment);
    let adjustedUtcString: string = utcStringAsArray.join('');

    return adjustedUtcString;
  }

    public getLocalTimeFromUtcStringOrDefault(meetingTimeUtc: string): Date {
      if(!!meetingTimeUtc){
        let utcStringAdjustedForTimeZone: string = this.adjustUtcStringToAccountForLocalOffSet(meetingTimeUtc, false);
        let meetingTimeAsDate: Date = new Date(utcStringAdjustedForTimeZone);
        return meetingTimeAsDate;
      } else {
        return new Date();
      }
    }

  private adjustHourSegmentForOffset(hours: number, localOffSetInHrs: number, isConvertingToLocal: boolean): number{
    let adjustedHours: number = undefined;

    if (isConvertingToLocal){
      adjustedHours = hours - localOffSetInHrs;
    } else {
      adjustedHours = hours + localOffSetInHrs;
    }

    adjustedHours = this.ensureTimeIsInTwentyFourHourFormat(adjustedHours);
    return adjustedHours;
  }

  private ensureTimeIsInTwentyFourHourFormat(hours: number): number {
    if (hours < 0 ){
      hours = 24 - Math.abs(hours);
    } else if (hours > 24) {
      let overrun: number = hours - 24;
      hours = overrun;
    } else if (hours == 24) {
      hours = 0;
    }

    return hours;
  }

  private addLeadingZeroIfMissing(hours: string): string{
    if(hours.length < 2){
      hours = `0${hours}`;
    }
    return hours;
  }

  /*
   * This is a hack to fix time preview being returned as the actual time in the model + 3 minutes
   * Note that this is, and should, only be used in a function generating data for the view (not saved)
   * Was tested with edge times like 6:02PM - somehow that time does NOT incorrectly get pushed to 5:59
   * ¯\_(ツ)_/¯
   */
  public hackTime(utcDate: string): any {
    let momentJsTime: any = moment(utcDate, 'HH:mm A');
    let timeAsDate: any = momentJsTime.toDate();
    let meetingTime: any = new Date(timeAsDate - (minutesAddedInexplicably * msInMinute));
    return meetingTime;
  }
}
