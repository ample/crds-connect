import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'no-results.component.html'
})

export class NoResultsComponent  {

  constructor(private router: Router) {}

  public btnClickBack()  {
    this.router.navigateByUrl('/neighbors');
  }
}
