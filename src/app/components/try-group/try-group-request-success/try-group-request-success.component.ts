import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// TODO: Define the URLs as constants

@Component({
  selector: 'app-try-group-request-success',
  templateUrl: 'try-group-request-success.component.html'
})
export class TryGroupRequestSuccessComponent implements OnInit {
  public groupId: string;

  constructor(private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
// TODO - TEST - does this still run as expected?
    // this.groupId = this.route.snapshot.paramMap.get('groupId'); 
    this.groupId = this.route.snapshot.params['groupId'];
  }

  public onClose(): void {
    this.router.navigate([`/small-group/${this.groupId}`]);
  }

  public onBackToGroup(): void {
    this.router.navigate([`/small-group/${this.groupId}`]);
  }

  public onFindAnotherGroup(): void {
    this.router.navigate([`/`]);
  }
}
