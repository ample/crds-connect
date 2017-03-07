import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';

import { Pin } from '../../../models/pin';


@Component({
  selector: 'person',
  templateUrl: 'person.html'
})
export class PersonComponent implements OnInit {

  @Input() pin: Pin;
  @Input() isPinOwner: boolean = false;
  @Input() isLoggedIn: boolean = false;

  public sayHiButtonText: string = "Say hi!";

  constructor() {
  }

  public ngOnInit() {
  }
}
