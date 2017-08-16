import { Component, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CreateGroupService } from '../create-group-data.service';
import { StateService } from '../../../services/state.service';

import { groupPaths } from '../../../shared/constants';

@Component({
  selector: 'create-group-footer',
  templateUrl: './create-group-footer.component.html',
  styles: ['.fauxdal-wrapper { overflow-y: hidden; } ']
})
export class CreateGroupFooterComponent {
  @Input() showbackbutton: boolean = true;
  @Output() backevent: EventEmitter<number> = new EventEmitter<number>();

  public showFauxdal: boolean = false;

  constructor(private router: Router,
              private createGroupService: CreateGroupService,
              private state: StateService) { }

  public OnBack() {
    this.backevent.emit(0);
  }

  public OnCancel() {
    this.showCancelFauxdal();
  }

  public cancelDeclined(): void {
      this.hideCancelFauxdal();
  }

  private showCancelFauxdal(): void {
    document.querySelector('body').style.overflowY = 'hidden';
    this.showFauxdal = true;
  }

  private hideCancelFauxdal(): void {
    document.querySelector('body').style.overflowY = 'auto';
    this.showFauxdal = false;
  }

  public cancelConfirmed(): void {
    this.createGroupService.reset();
    this.hideCancelFauxdal();

    if(this.state.getActiveGroupPath() === groupPaths.EDIT){
      this.router.navigate([`/small-group/${this.createGroupService.groupBeingEdited.groupId}`]);
    } else {
      this.router.navigate(['/create-group']);
    }
  }
}
