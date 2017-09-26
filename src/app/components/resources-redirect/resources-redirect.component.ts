import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeaderResourcesUrl, GroupResourcesUrl } from '../../shared/constants';
import { WindowService } from '../../services/window.service';

@Component({
  selector: 'app-resources-redirect',
  templateUrl: 'resources-redirect.html'
})
export class ResourcesRedirectComponent implements OnInit {
  constructor(private route: ActivatedRoute,
    private windowService: WindowService
  ) {}

  public ngOnInit() {
    const resourceType: string = this.route.snapshot.params['resourceType'];
    if (resourceType === 'leader') {
      this.windowService.nativeWindow.location.href = LeaderResourcesUrl;
    } else if (resourceType === 'group') {
      this.windowService.nativeWindow.location.href = GroupResourcesUrl;
    }
  }
}
