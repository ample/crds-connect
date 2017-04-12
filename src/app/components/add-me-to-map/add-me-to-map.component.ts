import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';

import { BlandPageService } from '../../services/bland-page.service';
import { StateService } from '../../services/state.service';
import { AddMeToTheMapHelperService } from '../../services/add-me-to-map-helper.service';
import { LocationService } from '../../services/location.service';
import { LookupTable } from '../../models/lookup-table';
import { Pin, pinType } from '../../models/pin';

import { UserDataForPinCreation } from '../../models/user-data-for-pin-creation';
import { Address } from '../../models/address';
import { AddressService } from '../../services/address.service';
import { usStatesList } from '../../shared/constants';
import { BlandPageDetails, BlandPageCause, BlandPageType } from '../../models/bland-page-details';
import { SessionService } from '../../services/session.service';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { UserLocationService } from '../../services/user-location.service';

@Component({
  selector: 'app-add-me-to-map',
  templateUrl: 'add-me-to-map.component.html'
})
export class AddMeToMapComponent implements OnInit {

  public userData: UserDataForPinCreation;
  public addMeToMapFormGroup: FormGroup;
  public stateList: Array<string>;
  public ready: boolean;

  constructor(private fb: FormBuilder,
    private hlpr: AddMeToTheMapHelperService,
    private router: Router,
    private route: ActivatedRoute,
    private state: StateService,
    private blandPageService: BlandPageService,
    private userLocationService: UserLocationService,
    private session: SessionService,
    private addressService: AddressService,
    private content: ContentService,
    private toast: ToastsManager) { }


  public ngOnInit(): void {
    this.userData = this.route.snapshot.data['userData'];

    this.state.setLoading(true);
    this.ready = false;
    this.addressService.getFullAddress(this.userData.participantId, pinType.PERSON)
    .finally(
      () => {
        this.state.setLoading(false);
        this.ready = true;
      })
    .subscribe(
      success => {
        this.userData.address = success;
      },
      error => {
        this.toast.error(this.content.getContent('errorRetrievingFullAddress'));
      }
    );
  }

  public onSubmit(value) {
    if (value) {
      this.state.setMyViewOrWorldView('world');
      this.state.setLastSearch(null);
      this.session.clearCache();
      this.state.setCurrentView('map');
      let nowAPin = new BlandPageDetails(
        'See for yourself',
        'nowAPin',
        BlandPageType.ContentBlock,
        BlandPageCause.Success,
        '',
        ''
      );
      this.blandPageService.primeAndGo(nowAPin);
    }
  }

  public closeClick() {
    this.router.navigate(['']);
  }
}

