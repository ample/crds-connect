import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'say-hi',
  templateUrl: 'say-hi.html'
})
export class SayHiComponent implements OnInit {

  @Input() isGathering: boolean = false;
  @Input() buttonText: string = "";

  constructor() {}

  public ngOnInit() {}

  public sayHi(){
    console.log("hi!")
  }

}
