import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StateService } from '../../services/state.service';

@Component({
  templateUrl: 'getting-started.component.html'
})
export class GettingStartedComponent implements OnInit {

  // public pins: any = [
  //   [
  //     {
  //       name: 'Larry M.',
  //       location: 'Washington, D.C.',
  //       host: true,
  //       image: 'https://api.adorable.io/avatars/200/larry.png'
  //     },
  //     {
  //       name: 'Vinny J.',
  //       location: 'Cincinnati, Ohio',
  //       host: false,
  //       image: 'https://api.adorable.io/avatars/200/vinny.png'
  //     },
  //   ],
  //   [
  //     {
  //       name: 'Camille B.',
  //       location: 'Seattle, Washington',
  //       host: false,
  //       image: 'https://api.adorable.io/avatars/200/camille.png'
  //     },
  //     {
  //       name: 'Nathan S.',
  //       location: 'Paris, France',
  //       host: false,
  //       image: 'https://api.adorable.io/avatars/200/nathan.png'
  //     }
  //   ]
  // ];

  constructor(private router: Router,
             private state: StateService) {}

  ngOnInit() {
    this.state.setPageHeader('Getting Started', '/');
    return true;
  }
}