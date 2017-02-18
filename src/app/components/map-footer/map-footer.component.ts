import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-map-footer',
  templateUrl: 'map-footer.component.html',
  styleUrls: ['map-footer.component.css']
})
export class MapFooterComponent {


  constructor(private fb: FormBuilder,
              private content: ContentService,
              private router: Router) { }

  public btnClick()  {
    this.router.navigateByUrl('/add-me-to-the-map');
  }
}

