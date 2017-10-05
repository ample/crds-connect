import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';

import { ContentService } from 'crds-ng2-content-block';
import { StateService } from '../../../services/state.service';
import { AddressService } from '../../../services/address.service';

import { Pin, pinType, User } from '../../../models';


@Component({
  selector: 'person',
  templateUrl: 'person.html'
})
export class PersonComponent implements OnInit {

  @Input() pin: Pin;
  @Input() isPinOwner: boolean = false;
  @Input() isLoggedIn: boolean = false;
  @Input() user: Pin;

  public sayHiButtonText: string = 'Say hi!';

  constructor(private addressService: AddressService, private state: StateService, private toast: ToastsManager,
    private content: ContentService, private router: Router) {
  }

  ngOnInit() {
    // what is this here for?
    window.scrollTo(0, 0);
    if (this.isPinOwner) {
      this.state.setLoading(true);
      this.addressService.getFullAddress(this.pin.participantId, pinType.PERSON).subscribe(
        success => {
          this.pin.address = success;
        },
        error => {
          this.content.getContent('errorRetrievingFullAddress').subscribe(message => this.toast.error(message.content));
        }, () => {
          this.state.setLoading(false);
        }
      );
    }
  }

  public edit() {
    this.router.navigate(['/person', this.pin.participantId, 'edit']);
  }
}
