import { Injectable } from '@angular/core';

import { Address } from '../models/address';
import { AddMeToMapFormFields } from '../models/add-me-to-map-form-fields';
import { HostRequestDto } from '../models/host-request-dto';
import { HostApplicatonForm } from '../models/host-application-form';
import { LookupTable } from '../models/lookup-table';
import { Pin, pinType } from '../models/pin';
import { UserDataForPinCreation } from '../models/user-data-for-pin-creation';

@Injectable()
export class HostApplicationHelperService {

  constructor() { }

  public convertFormToDto(hostForm: HostApplicatonForm, contactId: number): HostRequestDto {

    let dto: HostRequestDto = new HostRequestDto(
      contactId,
      hostForm.isHomeAddress ? hostForm.homeAddress : hostForm.groupAddress,
      hostForm.isHomeAddress,
      hostForm.contactNumber,
      hostForm.groupDescription
    );

    return dto;
  };

}
