import { CreateGroupService } from '../create-group-data.service';
import { Component, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'create-group-footer',
  templateUrl: './create-group-footer.component.html',
  styles: ['.fauxdal-wrapper { overflow-y: hidden; } ']
})
export class CreateGroupFooterComponent {
  @Input() showbackbutton: boolean = true;
  @Output() backevent: EventEmitter<number> = new EventEmitter<number>();

  public showFauxdal: boolean = false;

  constructor(private router: Router, private createGroupService: CreateGroupService) { }
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
    this.showFauxdal = true;
  }

  private hideCancelFauxdal(): void {
     this.showFauxdal = false;
  }

  private cancelConfirmed(): void {
    this.createGroupService.reset();
    this.hideCancelFauxdal();
     this.router.navigate(['/create-group']);
  }
}
