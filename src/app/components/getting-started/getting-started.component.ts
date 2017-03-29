import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StateService } from '../../services/state.service';

@Component({
  templateUrl: 'getting-started.component.html'
})
export class GettingStartedComponent implements OnInit {

  constructor(private router: Router,
             private state: StateService) {}

  ngOnInit() {
    this.state.setPageHeader('Getting Started', '/');
    return true;
  }
}