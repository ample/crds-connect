import { Component } from '@angular/core';

import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  constructor(private state: StateService) {}

}
