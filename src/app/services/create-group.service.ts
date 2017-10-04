import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GroupPaths, groupPaths } from '../shared/constants';

@Injectable()
export class CreateGroupService {
  constructor(private router: Router) {}
  public navigateInGroupFlow(pageToGoTo: number, editOrCreateMode: string, groupId: number): void {
    if (editOrCreateMode === groupPaths.ADD) {
      this.router.navigate([`/create-group/page-${pageToGoTo}`]);
    } else if (editOrCreateMode === groupPaths.EDIT) {
      this.router.navigate([`/edit-group/${groupId}/page-${pageToGoTo}`]);
    }
  }
}
