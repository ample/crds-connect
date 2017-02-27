import { Injectable } from '@angular/core';

import { Address } from '../models/address';
import { AddMeToMapFormFields } from '../models/add-me-to-map-form-fields';
import { LookupTable } from '../models/lookup-table';
import { Pin } from '../models/pin';
import { UserDataForPinCreation } from '../models/user-data-for-pin-creation';

@Injectable()
export class AddMeToTheMapHelperService {


  constructor() { }

  isObjectNumber (o) {
    return ! isNaN (o - 0) && o != null;
  }

  public setStateToStringIfNum (stateValue: string, stateList: Array<LookupTable>): string {

    let stateAsString: string;

    if ( this.isObjectNumber(stateValue) ) {
      stateAsString = stateList.find(state => state.dp_RecordID === Number(stateValue)).dp_RecordName;
    } else {
      stateAsString = stateValue;
    }

    return stateAsString;
  }

  public getStringField(data: UserDataForPinCreation, fieldName: string): string {
    let prepopulatedAddressValue: string;

    if (data.address !== null && data.address[fieldName]) {
      prepopulatedAddressValue = data.address[fieldName];
    } else {
      prepopulatedAddressValue = '';
    }

    return prepopulatedAddressValue;
  }

  // All the notes on this method are assumptions which need to be verified
  public createNewPin (addMeForm: AddMeToMapFormFields, initialUserData: UserDataForPinCreation ): Pin {

    let address = new Address(initialUserData.address.addressId, addMeForm.addressLine1, addMeForm.addressLine2,
        addMeForm.city, addMeForm.state, addMeForm.zip, initialUserData.address.longitude, initialUserData.address.latitude);

    let pin = new Pin(
      initialUserData.firstname,
      initialUserData.lastname,
      initialUserData.email,
      initialUserData.contactId,
      initialUserData.participantId,
      address,
      0, // not applied - the statuses need to be a constant enum on the front end
      null, // null if not a group
      initialUserData.householdId,
      addMeForm.isFormDirty
    );

    return pin;

  }

}
