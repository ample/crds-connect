import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-getting-started',
  templateUrl: 'getting-started.component.html',
  styleUrls: ['getting-started.component.css']
})
export class GettingStartedComponent {


  constructor(private content: ContentService,
              private router: Router) { }

  public btnClickAddToMap()  {
    this.router.navigate(['/add-me-to-the-map']);
  }
}

