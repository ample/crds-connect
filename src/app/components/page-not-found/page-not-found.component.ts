import { Angulartics2 } from 'angulartics2';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: 'page-not-found.component.html'
})
export class PageNotFoundComponent implements OnInit {

  constructor() { }
  /* TODO: Remove this component. It is not used and is only here so the routes file is happy. 
     The not found guard routes things back to maestro.
  */
  ngOnInit() {
  }

}
