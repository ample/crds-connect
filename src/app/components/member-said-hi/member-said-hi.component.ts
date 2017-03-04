import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-member-said-hi',
  templateUrl: 'member-said-hi.component.html'
})
export class MemberSaidHiComponent {


  constructor(private content: ContentService,
              private router: Router) {}

  public btnClick()  {
    this.router.navigateByUrl('/map');
  }
}