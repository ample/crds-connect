import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';

import { StateService } from '../../../services/state.service';
import { AddressService } from '../../../services/address.service';

import { Pin, pinType } from '../../../models/pin';
import { User } from '../../../models/user';


@Component({
  selector: 'person',
  templateUrl: 'person.html'
})
export class PersonComponent implements OnInit {

  @Input() pin: Pin;
  @Input() isPinOwner: boolean = false;
  @Input() isLoggedIn: boolean = false;
  @Input() user: User;

  public sayHiButtonText: string = 'Say hi!';

  constructor(private addressService: AddressService, private state: StateService, private toast: ToastsManager) {
  }

  ngOnInit() {
    if (this.isPinOwner) {
      this.state.setLoading(true);
      this.addressService.getAddress(this.pin.participantId, pinType.PERSON).subscribe(
        success => {
          this.pin.address = success;
          this.state.setLoading(false);
        },
        error => {
          this.toast.error('Looks like we were unable to get the full address', 'Oh no!');
        }
      );
    }
  }
}
