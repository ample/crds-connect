import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { APIService } from '../../services/api.service';
import { BlandPageService } from '../../services/bland-page.service';
import { StateService } from '../../services/state.service';
import { AddMeToTheMapHelperService } from '../../services/add-me-to-map-helper.service';
import { LocationService } from '../../services/location.service';
import { LookupTable } from '../../models/lookup-table';
import { Pin } from '../../models/pin';

import { UserDataForPinCreation } from '../../models/user-data-for-pin-creation';
import { Address } from '../../models/address';
import { usStatesList } from '../../shared/constants';
import { BlandPageDetails, BlandPageCause, BlandPageType, BlandPageButton } from '../../models/bland-page-details';



@Component({
  selector: 'app-add-me-to-map',
  templateUrl: 'add-me-to-map.component.html'
})
export class AddMeToMapComponent implements OnInit {

  public userData: UserDataForPinCreation;
  public addMeToMapFormGroup: FormGroup;
  public stateList: Array<string>;

  constructor(private api: APIService,
              private fb: FormBuilder,
              private hlpr: AddMeToTheMapHelperService,
              private router: Router,
              private route: ActivatedRoute,
              private state: StateService,
              private blandPageService: BlandPageService) { }


  public ngOnInit(): void {
    this.userData = this.route.snapshot.data['userData'];
    this.state.setLoading(false);
  }

  public onSubmit(value) {
    if (value) {
      this.state.setCurrentView('map');

      let succButton = new BlandPageButton(
        'See for yourself',
        null,
        ''
      );

      let buttons = new Array<BlandPageButton>();
      buttons.push(succButton);

      let nowAPin = new BlandPageDetails(
        'nowAPin',
        BlandPageType.ContentBlock,
        BlandPageCause.Success,
        'map',
        '',
        buttons
      );
      this.blandPageService.primeAndGo(nowAPin);
    }
  }

  public closeClick()  {
    this.router.navigate(['']);
  }
}

