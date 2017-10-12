import { StateService } from '../../../services/state.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-location-bar',
  templateUrl: './location-bar.component.html'
})
export class LocationBarComponent implements OnInit {
  public locationFormGroup: FormGroup;
  public location: string;
  @Output() submit = new EventEmitter();

  constructor(private state: StateService) { }

  ngOnInit() {
    const savedSearch = this.state.lastSearch;
    this.locationFormGroup = new FormGroup({
        location: new FormControl(this.location, []),
    });

    if ((savedSearch) && savedSearch.location != null) {
      this.location = savedSearch.location;
      this.locationFormGroup.controls['location'].setValue(savedSearch.location);
    }
  }

  onSubmit(): void {
    this.submit.emit();
  }

}
