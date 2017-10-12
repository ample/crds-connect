import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripTags'
})
export class StripTagsPipe implements PipeTransform {

  /* Removes html tags from a string */
  transform(input: string): any {

    if (input == null || typeof input !== 'string') {
      return input;
    }

    return input.replace(/<\S[^><]*>/g, '');
  }
}
