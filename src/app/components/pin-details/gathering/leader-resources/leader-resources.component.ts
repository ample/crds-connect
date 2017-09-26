import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GroupResourcesUrl, LeaderResourcesUrl } from '../../../../shared/constants';

@Component({
  selector: 'leader-resources',
  templateUrl: './leader-resources.html'
})
export class LeaderResourcesComponent  {
  constructor(private router: Router) {}

  public onLeaderResourcesClicked() {
    this.router.navigateByUrl('/resources/leader');
  }

  public onGroupResourcesClicked() {
    this.router.navigateByUrl('/resources/group');
  }
}
