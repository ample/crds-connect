import { ImageService } from '../services/image.service';
import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';

import { Observable } from 'rxjs/Observable';



@Component({
  selector: 'profile-picture',
  templateUrl: 'profile-picture.html'
})
export class ProfilePictureComponent implements OnInit {

  @Input() contactId: number;
  @Input() wrapperClass: string = '';
  @Input() imageClass: string = '';
  public path: string;


  constructor(private imageService: ImageService
              ) {

  }

  public ngOnInit() {
        this.path = this.imageService.ImageBaseURL + this.contactId;
  }


}
