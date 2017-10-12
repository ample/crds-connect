import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'UtcTimeFormat'
})


/**Format the date without TimeZone info*/
export class UtcTimeFormatPipe implements PipeTransform {


  transform(value: string): any {


    if (value === '' || value == null) {
      return null;
    } else if (value.toLowerCase().includes('am') || value.toLowerCase().includes('pm'))  {
      return value;
    }

    const dateValue = new Date(value);
    const datewithouttimezone = moment.utc([dateValue.getUTCFullYear(),
      dateValue.getUTCMonth(),
      dateValue.getUTCDate(),
      dateValue.getUTCHours(),
      dateValue.getUTCMinutes(),
      dateValue.getUTCSeconds()]);
    return datewithouttimezone.format('h:mm a');
  }

}
