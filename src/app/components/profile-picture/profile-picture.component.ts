import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';



@Component({
  selector: 'profile-picture',
  templateUrl: 'profile-picture.html',
  styleUrls: ['profile-picture.scss']
})
export class ProfilePictureComponent implements OnInit {

  @Input() contactId: number;
  @Input() wrapperClass: string = '';
  @Input() imageClass: string = '';
  private path: string;
  private baseUrl: string = process.env.CRDS_API_ENDPOINT;
  private DefaultProfileImage: string = '//crossroads-media.imgix.net/images/avatar.svg';
  private ImageBaseURL: string = `${this.baseUrl}api/v1.0.0/image/profile/`;


  constructor() {

  }

  public ngOnInit() {
        this.path = this.ImageBaseURL + this.contactId;
  }
}
