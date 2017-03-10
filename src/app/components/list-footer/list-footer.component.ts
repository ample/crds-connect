import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-footer',
  templateUrl: 'list-footer.component.html',
  styleUrls: ['list-footer.component.css']
})
export class ListFooterComponent {


  constructor(private router: Router) { }

  public myPinBtnClicked()  {
    this.router.navigateByUrl('/add-me-to-the-map');
  }
}

