import { CreateGroupService } from '../create-group-data.service';
import { Component, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'create-group-footer',
  templateUrl: './create-group-footer.component.html',
})
export class CreateGroupFooterComponent {
  @ViewChild('cancelModal') public cancelModal: ModalDirective;
  @Input() showbackbutton: boolean = true;
  @Output() backevent: EventEmitter<number> = new EventEmitter<number>();

  constructor(private router: Router, private createGroupService: CreateGroupService) { }
  public OnBack() {
    this.backevent.emit(0);
  }

  public OnCancel() {
    this.showCancelModal();
  }

  public cancelDeclined(): void {
     this.cancelModal.hide();
  }

  private showCancelModal(): void {
    this.cancelModal.show();
  }

  private hideCancelModal(): void {
     this.cancelModal.hide();
  }

  private cancelConfirmed(): void {
    this.createGroupService.reset();
    this.cancelModal.hide();
     this.router.navigate(['/create-group']);
  }

}
