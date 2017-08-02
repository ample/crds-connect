import { EventEmitter  } from '@angular/core';
import { Injectable } from '@angular/core';

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
}
