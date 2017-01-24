import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Http } from '@angular/http';


@Injectable()
export class LocationService {

  constructor(private http: Http) {}

  public initMap() {   }

}
