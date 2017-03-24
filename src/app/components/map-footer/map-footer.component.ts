import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { StateService } from '../../services/state.service';
import { BlandPageService } from '../../services/bland-page.service';

@Component({
  selector: 'app-map-footer',
  templateUrl: 'map-footer.component.html'
})
export class MapFooterComponent {


  constructor(private router: Router,
              private state: StateService,
              private blandPageService: BlandPageService) { }

  public myPinBtnClicked()  {
    this.state.setCurrentView('map');
    this.router.navigateByUrl('/add-me-to-the-map');
  }

  public gettingStartedBtnClicked()  {
    this.state.setCurrentView('map');
    this.blandPageService.goToGettingStarted();
  }
}

