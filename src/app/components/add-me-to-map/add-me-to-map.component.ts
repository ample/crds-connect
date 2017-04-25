import { Angulartics2 } from 'angulartics2';
import { PinService } from '../../services/pin.service';
import { Component, OnInit, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastsManager } from 'ng2-toastr';

import { BlandPageService } from '../../services/bland-page.service';
import { StateService } from '../../services/state.service';
import { LocationService } from '../../services/location.service';
import { LookupTable } from '../../models/lookup-table';
import { Pin, pinType } from '../../models/pin';

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
export class AddMeToMapComponent implements OnInit, AfterViewInit {

  public userData: Pin;
  public addMeToMapForm: FormGroup;
  public stateList: Array<string>;
  public ready: boolean;
  public submissionError: boolean = false;
  private submitting: boolean = false;

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private state: StateService,
    private blandPageService: BlandPageService,
    private userLocationService: UserLocationService,
    private session: SessionService,
    private addressService: AddressService,
    private content: ContentService,
    private toast: ToastsManager,
    private location: Location,
    private pinService: PinService) { }


  public ngOnInit(): void {
    this.state.setLoading(true);
    this.userData = this.route.snapshot.data['userData'];
    this.addMeToMapForm = new FormGroup({});

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

  public ngAfterViewInit() {
    // This component is rendered within a fauxdal,
    // so we need the following selector added to <body> element
    document.querySelector('body').classList.add('modal-open');
  }

  public onSubmit(value) {
    this.submitting = true;
    this.setSubmissionErrorWarningTo(false);
    this.pinService.postPin(this.userData).subscribe(
      pin => {
        this.state.setMyViewOrWorldView('world');
        this.state.setCurrentView('map');
        this.state.setLastSearch(null);
        this.session.clearCache();

        this.state.navigatedFromAddToMapComponent = true;
        this.state.postedPin = this.userData;

        let nowAPin = new BlandPageDetails(
          'See for yourself',
          'finderNowAPin',
          BlandPageType.ContentBlock,
          BlandPageCause.Success,
          '',
          ''
        );
        this.blandPageService.primeAndGo(nowAPin);
      },
      err => {
        this.setSubmissionErrorWarningTo(true);
        this.submitting = false;
      }
    );
    if (value != null) {

    }
  }

  public closeClick() {
    this.location.back();
  }

  public setSubmissionErrorWarningTo(isErrorActive) {
    this.submissionError = isErrorActive;
  }
}
