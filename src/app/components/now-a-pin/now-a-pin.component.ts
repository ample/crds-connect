import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-now-a-pin',
  templateUrl: 'now-a-pin.component.html',
  styleUrls: ['now-a-pin.component.css']
})
export class NowAPinComponent implements OnInit {


  constructor(private fb: FormBuilder,
              private content: ContentService,
              private route: ActivatedRoute) { }


  public ngOnInit(): void {


  }

  public onSubmit({ value, valid }: { value: any, valid: boolean }) {
    console.log(value, valid);
  }

}

