import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-now-a-pin',
  templateUrl: 'now-a-pin.component.html',
  styleUrls: ['now-a-pin.component.css']
})
export class NowAPinComponent {


  constructor(private fb: FormBuilder,
              private content: ContentService,
              private router: Router) { }

  public btnClick()  {
    this.router.navigateByUrl('/');
  }
}

