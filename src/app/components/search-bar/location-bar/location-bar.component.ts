import { StateService } from '../../../services/state.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-location-bar',
  templateUrl: './location-bar.component.html',
  styleUrls: ['./location-bar.component.css']
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

    if ((savedSearch) && savedSearch.locationSearch != null) {
      this.location = savedSearch.locationSearch;
      this.locationFormGroup.controls['location'].setValue(savedSearch.locationSearch);
    }
  }

  onSubmit(): void {
    this.submit.emit();
  }

}
