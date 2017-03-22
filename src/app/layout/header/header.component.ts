import { Component } from '@angular/core';

import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  // Toggle brand bar with this.state.hasBrandBar = true/false;

  constructor(private state: StateService) {}

}
