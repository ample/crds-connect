import { StateService } from '../../../services/state.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-location-bar',
  templateUrl: './location-bar.component.html',
  styleUrls: ['./location-bar.component.css']
})
export class LocationBarComponent implements OnInit {
  public locationFormGroup: FormGroup;
  public location: string;

  constructor(private state: StateService) { }

  ngOnInit() {
    let savedSearch = this.state.lastSearch;
    this.locationFormGroup = new FormGroup({
        location: new FormControl(this.location, []),
    });

    if ((savedSearch) && savedSearch.location != null) {
      this.locationFormGroup.controls['location'].setValue(savedSearch.location);
    }
  }

}
