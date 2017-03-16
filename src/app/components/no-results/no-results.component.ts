import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { StateService } from '../../services/state.service';

@Component({
  templateUrl: 'no-results.component.html'
})

export class NoResultsComponent  {

  constructor(private router: Router,
              private state: StateService) {}

  public btnClickBack()  {
    this.router.navigateByUrl('/neighbors');
  }
}
