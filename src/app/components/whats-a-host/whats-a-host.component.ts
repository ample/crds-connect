import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-getting-started',
  templateUrl: 'whats-a-host.component.html',
  styleUrls: ['whats-a-host.component.css']
})
export class WhatsAHostComponent {


  constructor(private content: ContentService,
              private router: Router) { }

  public signUpToHostClicked()  {
    this.router.navigateByUrl('/host-signup');
  }

  public closeClick()  {
    this.router.navigateByUrl('/map');
  }
}

