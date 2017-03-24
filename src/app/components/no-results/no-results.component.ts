import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'no-results.component.html'
})

export class NoResultsComponent implements OnInit {
  private groupUrl: string;

  constructor(private router: Router) {
  }

  public ngOnInit(): void {
    this.groupUrl = `//${process.env.CRDS_ENV || 'www'}.crossroads.net/groups/search`;
  }

  public btnClickBack()  {
    this.router.navigateByUrl('/neighbors');
  }

  public btnClickAddToMap()  {
    this.router.navigateByUrl('/add-me-to-the-map');
  }

  public btnClickFindOnlineGroup()  {
    window.open(this.groupUrl);
  }

}
