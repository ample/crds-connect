import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { BlandPageService } from '../../services/bland-page.service';
import { StateService } from '../../services/state.service';
import { AddMeToTheMapHelperService } from '../../services/add-me-to-map-helper.service';
import { LocationService } from '../../services/location.service';
import { LookupTable } from '../../models/lookup-table';
import { Pin } from '../../models/pin';

import { UserDataForPinCreation } from '../../models/user-data-for-pin-creation';
import { Address } from '../../models/address';
import { usStatesList } from '../../shared/constants';
import { BlandPageDetails, BlandPageCause, BlandPageType } from '../../models/bland-page-details';
import { SessionService } from '../../services/session.service';
import { UserLocationService } from '../../services/user-location.service';



@Component({
  selector: 'app-add-me-to-map',
  templateUrl: 'add-me-to-map.component.html'
})
export class AddMeToMapComponent implements OnInit {

  public userData: UserDataForPinCreation;
  public addMeToMapFormGroup: FormGroup;
  public stateList: Array<string>;

  constructor(private fb: FormBuilder,
              private hlpr: AddMeToTheMapHelperService,
              private router: Router,
              private route: ActivatedRoute,
              private state: StateService,
              private blandPageService: BlandPageService,
              private userLocationService: UserLocationService,
              private session: SessionService) { }


  public ngOnInit(): void {
    this.userData = this.route.snapshot.data['userData'];
    this.state.setLoading(false);
  }

  public onSubmit(value: Pin) {
    if (value != null) {
      this.state.setMyViewOrWorldView('world');
      this.state.setCurrentView('map');
      this.state.setLastSearch(null);
      this.session.clearCache();

      this.state.navigatedFromAddToMapComponent = true;
      this.state.setPostedPin(value);

      let nowAPin = new BlandPageDetails(
        'See for yourself',
        'finderNowAPin',
        BlandPageType.ContentBlock,
        BlandPageCause.Success,
        'map',
        ''
      );
      this.blandPageService.primeAndGo(nowAPin);
    }
  }

  public closeClick()  {
    this.router.navigate(['']);
  }
}

