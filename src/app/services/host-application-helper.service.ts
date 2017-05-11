import { Injectable } from '@angular/core';

import { Address } from '../models/address';
import { AddMeToMapFormFields } from '../models/add-me-to-map-form-fields';
import { HostRequestDto } from '../models/host-request-dto';
import { HostApplicatonForm } from '../models/host-application-form';
import { LookupTable } from '../models/lookup-table';
import { Pin, pinType } from '../models/pin';

// TODO: Remove this service. 
@Injectable()
export class HostApplicationHelperService {

  constructor() { }

  // TODO: Should we do this in the component or the model? Do we need these models?
  public convertFormToDto(hostForm: HostApplicatonForm, contactId: number): HostRequestDto {

    let dto: HostRequestDto = new HostRequestDto(
      contactId,
      hostForm.isHomeAddress ? hostForm.homeAddress : hostForm.groupAddress,
      hostForm.isHomeAddress,
      this.formatPhoneNumber(hostForm.contactNumber),
      hostForm.gatheringDescription
    );

    return dto;
  };

  // TODO: extract into an angular pipe
  // https://angular.io/docs/ts/latest/guide/pipes.html
  // ex: http://davidsdotnetlines.blogspot.com/2016/10/angular2-custom-pipe-for-phone.html
  // Or use angular2-text-mask package
  public formatPhoneForUi(mobilePhone: string): string {
    if (!mobilePhone) { return ''; }

    let parsedPhone: string;

    try {
      parsedPhone = mobilePhone.split('-').join('');
    } catch (err) {
      parsedPhone = '';
    }

    return parsedPhone;
  }

  // Format the 10 digit number received from form into xxx-xxx-xxxx format (from xxxxxxxxxx)
  // Temporary method 
  // Included in above todo. 
  public formatPhoneNumber(phoneNumber: string) {
    let areaCode: string = phoneNumber.slice(0, 3);
    let firstThree: string = phoneNumber.slice(3, 6);
    let lastFour: string = phoneNumber.slice(6, 10);

    let formattedNumber = areaCode + '-' + firstThree + '-' + lastFour;

    return formattedNumber;
  }

  // TODO: extract into an angular pipe
  // https://angular.io/docs/ts/latest/guide/pipes.html
  // ex: http://davidsdotnetlines.blogspot.com/2016/10/angular2-custom-pipe-for-phone.html
  // Or use angular2-text-mask package
  public stripHtmlFromString (textWithHtml: string): string {
    let sanitizedString: string = textWithHtml.replace(/<(?:.|\n)*?>/gm, '');
    return sanitizedString;
  }

}
