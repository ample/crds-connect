import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'profile-picture',
  templateUrl: 'profile-picture.html'
})
export class ProfilePictureComponent implements OnInit {

  @Input() contactId: number;
  @Input() wrapperClass: string = '';
  @Input() imageClass: string = '';
  public path: string;
  private baseUrl: string = environment.CRDS_GATEWAY_CLIENT_ENDPOINT;
  private ImageBaseURL: string = `${this.baseUrl}api/v1.0.0/image/profile/`;

  constructor() {

  }

  public ngOnInit() {
        this.path = this.ImageBaseURL + this.contactId;
  }
}
