import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';

import { Pin } from '../../../models/pin';
import { User } from '../../../models/user';


@Component({
  selector: 'person',
  templateUrl: 'person.html'
})
export class PersonComponent {

  @Input() pin: Pin;
  @Input() isPinOwner: boolean = false;
  @Input() isLoggedIn: boolean = false;
  @Input() user: User;

  public sayHiButtonText: string = "Say hi!";

  constructor() {
  }
}
