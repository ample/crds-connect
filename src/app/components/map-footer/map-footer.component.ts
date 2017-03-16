import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-map-footer',
  templateUrl: 'map-footer.component.html',
  styleUrls: ['map-footer.component.scss']
})
export class MapFooterComponent {


  constructor(private router: Router,
              private state: StateService) { }

  public myPinBtnClicked()  {
    this.state.setCurrentView('map');
    this.router.navigateByUrl('/add-me-to-the-map');
  }

  public gettingStartedBtnClicked()  {
    this.state.setCurrentView('map');
    this.router.navigateByUrl('/getting-started');
  }
}

