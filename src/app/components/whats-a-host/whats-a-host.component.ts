import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { ActivatedRoute, Router } from '@angular/router';

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
}

