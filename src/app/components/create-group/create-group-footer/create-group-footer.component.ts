import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { BlandPageService } from '../../../services/bland-page.service';
import { CreateGroupService } from '../create-group-data.service';
import { StateService } from '../../../services/state.service';

@Component({
  selector: 'create-group-footer',
  templateUrl: './create-group-footer.component.html',
})
export class CreateGroupFooterComponent implements OnInit {
  @Input() showbackbutton: boolean = true;
  @Output() backevent: EventEmitter<number> = new EventEmitter<number>();
  @Output() cancelevent: EventEmitter<number> = new EventEmitter<number>();

  constructor(private router: Router, private state: StateService) { }

  ngOnInit() {  }


  public OnBack() {
    this.backevent.emit(0);
  }

  public OnCancel() {
    this.cancelevent.emit(0);
  }
}
