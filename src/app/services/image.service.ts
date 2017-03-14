import { Injectable, NgZone } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { SessionService } from './session.service';

import { IFrameParentService } from './iframe-parent.service';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ImageService {

  private baseUrl: string = process.env.CRDS_API_ENDPOINT;
  public DefaultProfileImage: string = '//crossroads-media.imgix.net/images/avatar.svg';
  public ImageBaseURL: string = `${this.baseUrl}api/v1.0.0/image/profile/`;

  public restVerbs = {
    post: 'POST',
    put: 'PUT'
  };

  public defaults = {
    authorized: null
  };

  constructor( private http: Http,
               private session: SessionService) { }

}
