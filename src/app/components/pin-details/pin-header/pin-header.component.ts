import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';
import { Address } from '../../../models/address';

@Component({
  selector: 'pin-header',
  templateUrl: 'pin-header.html'
})
export class PinHeaderComponent {

  @Input() isGathering: boolean = false;
  @Input() isPinOwner: boolean = false;
  @Input() firstName: string = "";
  @Input() lastName: string = "";

  constructor() {}

}
