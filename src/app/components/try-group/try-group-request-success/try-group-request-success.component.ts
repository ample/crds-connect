import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// TODO: Define the URLs as constants

@Component({
  selector: 'app-try-group-request-success',
  templateUrl: 'try-group-request-success.component.html'
})
export class TryGroupRequestSuccessComponent implements OnInit {
  private groupId: string;

  constructor(private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('groupId');
  }

  public onBackToGroup(): void {
    this.router.navigate([`/small-group/${this.groupId}`]);
  }

  public onFindAnotherGroup(): void {
    this.router.navigate([`/`]);
  }

  public onClose(): void {
    this.router.navigate([`/small-group/${this.groupId}`]);
  }
}
