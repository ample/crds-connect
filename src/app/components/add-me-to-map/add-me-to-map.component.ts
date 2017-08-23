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
import { MapView } from '../../models/map-view';

import { Address } from '../../models/address';
import { AddressService } from '../../services/address.service';
import { initialMapZoom, usStatesList, ViewType } from '../../shared/constants';
import { BlandPageDetails, BlandPageCause, BlandPageType } from '../../models/bland-page-details';
import { SessionService } from '../../services/session.service';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { UserLocationService } from '../../services/user-location.service';
import { GoogleMapService } from '../../services/google-map.service';

@Component({
  selector: 'app-add-me-to-map',
  templateUrl: 'add-me-to-map.component.html'
})
export class AddMeToMapComponent implements OnInit, AfterViewInit {

  public userData: Pin;
  public addMeToMapForm: FormGroup;
  public stateList: Array<string>;
  public ready: boolean;
  public isFormSubmitted: boolean = false;

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
    private pinService: PinService,
    private mapHlpr: GoogleMapService
  ) {}


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
    document.querySelector('body').classList.add('fauxdal-open');
  }

  public onSubmit({valid}: {valid: boolean}) {
    this.isFormSubmitted = true;

    if (valid) {
      this.pinService.postPin(this.userData).subscribe(
        pin => {
          this.state.setMyViewOrWorldView('world');
          this.state.setCurrentView(ViewType.MAP);
          this.state.setLastSearch(null);
          this.session.clearCache();

          this.state.navigatedFromAddToMapComponent = true;
          this.state.postedPin = pin;

          let nowAPin = new BlandPageDetails(
            'See for yourself',
            'finderNowAPin',
            BlandPageType.ContentBlock,
            BlandPageCause.Success,
            '',
            ''
          );
          this.blandPageService.primeAndGo(nowAPin);

          this.centerMapOnNewPin(pin);
        },
        err => {
          this.isFormSubmitted = false;
        }
      );
    }
  }

  private centerMapOnNewPin(pin): void {
    let zoom = this.mapHlpr.calculateZoom(initialMapZoom, pin.address.latitude, pin.address.longitude, [pin], this.state.getMyViewOrWorldView());
    let mapViewUpdate = new MapView('newPin', pin.address.latitude, pin.address.longitude, zoom);
    this.state.setMapView(mapViewUpdate);
  }

  public closeClick() {
    this.location.back();
  }
}
